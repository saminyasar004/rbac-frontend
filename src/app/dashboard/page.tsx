'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardData {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  myLeads: number;
  myTasks: number;
}

interface OverviewStats {
  totalUsers: number;
  totalLeads: number;
  totalTasks: number;
}

export default function DashboardPage() {
  const { user, hasPermission } = useAuthStore();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [overviewStats, setOverviewStats] = useState<OverviewStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [dashboardResponse, overviewResponse] = await Promise.all([
          api.get('/dashboard'),
          hasPermission('reports.view') ? api.get('/reports/overview') : Promise.resolve(null),
        ]);

        setDashboardData(dashboardResponse.data);

        if (overviewResponse) {
          setOverviewStats(overviewResponse.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [hasPermission]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8A65]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-linear-to-r from-[#FF8A65] to-[#FF7043] rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Welcome back, {user?.firstName}! 👋
        </h2>
        <p className="text-orange-100">
          Here's what's happening with your account today.
        </p>
      </div>

      {/* Personal Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="hover:shadow-lg transition-all duration-200 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-500 uppercase tracking-wider">My Leads</CardTitle>
            <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
              <span className="text-xl">📋</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 tracking-tight">{dashboardData?.myLeads || 0}</div>
            <p className="text-xs text-gray-400 font-medium mt-1">
              Currently assigned to you
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-500 uppercase tracking-wider">My Tasks</CardTitle>
            <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <span className="text-xl">✅</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 tracking-tight">{dashboardData?.myTasks || 0}</div>
            <p className="text-xs text-gray-400 font-medium mt-1">
              Active tasks in progress
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Role</CardTitle>
            <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
              <span className="text-xl">👤</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 capitalize tracking-tight">{user?.role}</div>
            <p className="text-xs text-gray-400 font-medium mt-1">
              Your system access level
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Status</CardTitle>
            <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-xl">🟢</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 tracking-tight">Active</div>
            <p className="text-xs text-gray-400 font-medium mt-1">
              Account is in good standing
            </p>
          </CardContent>
        </Card>
      </div>

      {/* System Overview (Admin/Manager only) */}
      {overviewStats && (
        <div className="pt-2">
          <h3 className="text-lg font-bold text-gray-900 mb-4 px-1">System Overview</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Users</CardTitle>
                <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">👥</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 tracking-tight">{overviewStats.totalUsers}</div>
                <p className="text-xs text-gray-400 font-medium mt-1">
                  Total registered members
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Leads</CardTitle>
                <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">📋</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 tracking-tight">{overviewStats.totalLeads}</div>
                <p className="text-xs text-gray-400 font-medium mt-1">
                  Global pipeline records
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Tasks</CardTitle>
                <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">✅</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 tracking-tight">{overviewStats.totalTasks}</div>
                <p className="text-xs text-gray-400 font-medium mt-1">
                  System-wide active tasks
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="pt-2">
        <h3 className="text-lg font-bold text-gray-900 mb-4 px-1">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {hasPermission('users.view') && (
            <Card className="cursor-pointer hover:shadow-lg hover:bg-orange-50/50 transition-all duration-200 border-none shadow-sm group">
              <CardContent className="p-6 text-center">
                <span className="text-4xl mb-3 block group-hover:scale-110 transition-transform">👥</span>
                <p className="text-[14px] font-bold text-gray-700">Manage Users</p>
              </CardContent>
            </Card>
          )}

          {hasPermission('leads.manage') && (
            <Card className="cursor-pointer hover:shadow-lg hover:bg-orange-50/50 transition-all duration-200 border-none shadow-sm group">
              <CardContent className="p-6 text-center">
                <span className="text-4xl mb-3 block group-hover:scale-110 transition-transform">📋</span>
                <p className="text-[14px] font-bold text-gray-700">Create Lead</p>
              </CardContent>
            </Card>
          )}

          {hasPermission('tasks.manage') && (
            <Card className="cursor-pointer hover:shadow-lg hover:bg-orange-50/50 transition-all duration-200 border-none shadow-sm group">
              <CardContent className="p-6 text-center">
                <span className="text-4xl mb-3 block group-hover:scale-110 transition-transform">✅</span>
                <p className="text-[14px] font-bold text-gray-700">New Task</p>
              </CardContent>
            </Card>
          )}

          {hasPermission('reports.view') && (
            <Card className="cursor-pointer hover:shadow-lg hover:bg-orange-50/50 transition-all duration-200 border-none shadow-sm group">
              <CardContent className="p-6 text-center">
                <span className="text-4xl mb-3 block group-hover:scale-110 transition-transform">📊</span>
                <p className="text-[14px] font-bold text-gray-700">View Reports</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}