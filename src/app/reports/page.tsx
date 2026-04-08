'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface OverviewStats {
  totalUsers: number;
  totalLeads: number;
  totalTasks: number;
}

interface UserStats {
  total: number;
  active: number;
  suspended: number;
  banned: number;
}

interface LeadStats {
  total: number;
  byStatus: { status: string; count: number }[];
}

interface TaskStats {
  total: number;
  byStatus: { status: string; count: number }[];
}

export default function ReportsPage() {
  const { hasPermission } = useAuthStore();
  const [overviewStats, setOverviewStats] = useState<OverviewStats | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [leadStats, setLeadStats] = useState<LeadStats | null>(null);
  const [taskStats, setTaskStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [overviewRes, userRes, leadRes, taskRes] = await Promise.all([
          api.get('/reports/overview'),
          api.get('/reports/users'),
          api.get('/reports/leads'),
          api.get('/reports/tasks'),
        ]);

        setOverviewStats(overviewRes.data);
        setUserStats(userRes.data);
        setLeadStats(leadRes.data);
        setTaskStats(taskRes.data);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      } finally {
        setLoading(false);
      }
    };

    if (hasPermission('reports.view')) {
      fetchReports();
    } else {
      setLoading(false);
    }
  }, [hasPermission]);

  if (!hasPermission('reports.view')) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to view reports.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8A65]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Reports & Analytics</h1>
        <p className="text-sm text-gray-500 font-medium">Deep dive into system performance and metrics</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <div className="overflow-x-auto pb-1 scrollbar-hide">
          <TabsList className="inline-flex w-full sm:w-auto h-12 p-1 bg-gray-100 rounded-xl gap-1">
            <TabsTrigger value="overview" className="rounded-lg font-bold px-6 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Overview</TabsTrigger>
            <TabsTrigger value="users" className="rounded-lg font-bold px-6 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Users</TabsTrigger>
            <TabsTrigger value="leads" className="rounded-lg font-bold px-6 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Leads</TabsTrigger>
            <TabsTrigger value="tasks" className="rounded-lg font-bold px-6 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Tasks</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden group hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">Total Users</CardTitle>
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-xl">👥</span>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="text-3xl font-black text-gray-900 tracking-tight">{overviewStats?.totalUsers || 0}</div>
                <p className="text-[11px] text-gray-400 font-bold uppercase mt-1 tracking-tighter">
                  Active system members
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden group hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">Total Leads</CardTitle>
                <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-xl">📋</span>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="text-3xl font-black text-gray-900 tracking-tight">{overviewStats?.totalLeads || 0}</div>
                <p className="text-[11px] text-gray-400 font-bold uppercase mt-1 tracking-tighter">
                  Opportunities in pipeline
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden group hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">Total Tasks</CardTitle>
                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-xl">✅</span>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="text-3xl font-black text-gray-900 tracking-tight">{overviewStats?.totalTasks || 0}</div>
                <p className="text-[11px] text-gray-400 font-bold uppercase mt-1 tracking-tighter">
                  Active working items
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="text-center border-none shadow-sm bg-white rounded-2xl group hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-8">
                <div className="text-3xl font-black text-blue-600 tracking-tighter group-hover:scale-110 transition-transform">{userStats?.total || 0}</div>
                <p className="text-[11px] text-gray-400 font-bold uppercase mt-2 tracking-widest">Total Users</p>
              </CardContent>
            </Card>

            <Card className="text-center border-none shadow-sm bg-white rounded-2xl group hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-8">
                <div className="text-3xl font-black text-green-600 tracking-tighter group-hover:scale-110 transition-transform">{userStats?.active || 0}</div>
                <p className="text-[11px] text-gray-400 font-bold uppercase mt-2 tracking-widest">Active</p>
              </CardContent>
            </Card>

            <Card className="text-center border-none shadow-sm bg-white rounded-2xl group hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-8">
                <div className="text-3xl font-black text-yellow-600 tracking-tighter group-hover:scale-110 transition-transform">{userStats?.suspended || 0}</div>
                <p className="text-[11px] text-gray-400 font-bold uppercase mt-2 tracking-widest">Suspended</p>
              </CardContent>
            </Card>

            <Card className="text-center border-none shadow-sm bg-white rounded-2xl group hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-8">
                <div className="text-3xl font-black text-red-600 tracking-tighter group-hover:scale-110 transition-transform">{userStats?.banned || 0}</div>
                <p className="text-[11px] text-gray-400 font-bold uppercase mt-2 tracking-widest">Banned</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leads" className="space-y-6">
          <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-gray-50 bg-gray-50/30">
              <CardTitle className="text-lg font-bold">Lead Status Distribution</CardTitle>
              <CardDescription>Visual breakdown of your current sales pipeline.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <div className="space-y-6 max-w-2xl">
                {leadStats?.byStatus.map((item) => (
                  <div key={item.status} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-gray-700 capitalize tracking-tight">{item.status.toLowerCase()}</span>
                        <span className="text-xs text-gray-400 font-bold">({item.count})</span>
                      </div>
                      <span className="text-xs font-bold text-primary">
                        {leadStats.total > 0 ? Math.round((item.count / leadStats.total) * 100) : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-1000 shadow-sm"
                        style={{
                          width: `${leadStats.total > 0 ? (item.count / leadStats.total) * 100 : 0}%`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-gray-50 bg-gray-50/30">
              <CardTitle className="text-lg font-bold">Task Progress Metrics</CardTitle>
              <CardDescription>Breakdown of workflow task completion status.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <div className="space-y-6 max-w-2xl">
                {taskStats?.byStatus.map((item) => (
                  <div key={item.status} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-gray-700 capitalize tracking-tight">{item.status.toLowerCase().replace('_', ' ')}</span>
                        <span className="text-xs text-gray-400 font-bold">({item.count})</span>
                      </div>
                      <span className="text-xs font-bold text-orange-500">
                        {taskStats.total > 0 ? Math.round((item.count / taskStats.total) * 100) : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
                      <div
                        className="bg-orange-400 h-full rounded-full transition-all duration-1000 shadow-sm"
                        style={{
                          width: `${taskStats.total > 0 ? (item.count / taskStats.total) * 100 : 0}%`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}