'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Key, Plus, Trash2, Search, Filter, ShieldCheck } from 'lucide-react';

interface Permission {
  id: string;
  name: string;
  description: string;
}

export default function PermissionsPage() {
  const { hasPermission } = useAuthStore();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [search, setSearch] = useState('');

  const [form, setForm] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const { data } = await api.get('/permissions');
      setPermissions(data);
    } catch (error) {
      console.error('Failed to fetch permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePermission = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/permissions', form);
      setForm({ name: '', description: '' });
      setShowCreateDialog(false);
      fetchPermissions();
    } catch (error) {
      console.error('Failed to create permission:', error);
    }
  };

  const handleDeletePermission = async (id: string) => {
    if (!confirm('Are you sure you want to delete this permission? This may affect existing roles.')) return;
    try {
      await api.delete(`/permissions/${id}`);
      fetchPermissions();
    } catch (error) {
      console.error('Failed to delete permission:', error);
    }
  };

  const filteredPermissions = permissions.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.description?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-xs font-bold text-gray-400 tracking-widest uppercase">Loading Permissions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">System Permissions</h1>
          <p className="text-sm text-gray-500 font-medium">Define and manage granular access control atoms.</p>
        </div>
        {hasPermission('permissions.manage') && (
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 font-bold h-11 px-6 rounded-xl gap-2">
                <Plus size={18} />
                Add Permission
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white rounded-2xl p-0 overflow-hidden border-none shadow-2xl">
              <div className="p-8">
                <DialogHeader className="mb-6">
                  <DialogTitle className="text-xl font-bold">New Permission Atom</DialogTitle>
                  <DialogDescription>Create a new granular permission that can be assigned to roles or users.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreatePermission} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs font-bold text-gray-500 uppercase ml-1">Key Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g. system.analytics.view"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value.toLowerCase() })}
                      required
                      className="h-12 rounded-xl border-gray-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="description" className="text-xs font-bold text-gray-500 uppercase ml-1">Purpose/Description</Label>
                    <Input
                      id="description"
                      placeholder="What does this gate protect?"
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="h-12 rounded-xl border-gray-200"
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="ghost" onClick={() => setShowCreateDialog(false)} className="rounded-xl font-bold h-11 px-6">
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-primary hover:bg-primary/90 text-white font-bold h-11 px-8 rounded-xl shadow-lg shadow-primary/20">
                      Create Key
                    </Button>
                  </div>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                     <CardTitle className="text-lg font-bold">Base Permissions</CardTitle>
                     <CardDescription>All defined access keys in the system.</CardDescription>
                </div>
                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <Input 
                        placeholder="Search permissions..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 h-10 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all"
                    />
                </div>
            </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow className="border-b border-gray-100">
                  <TableHead className="w-[80px] py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">ID</TableHead>
                  <TableHead className="py-4 font-bold text-gray-700 uppercase text-[11px] tracking-wider">Access Key</TableHead>
                  <TableHead className="py-4 font-bold text-gray-700 uppercase text-[11px] tracking-wider">Description</TableHead>
                  <TableHead className="text-right py-4 font-bold text-gray-700 uppercase text-[11px] tracking-wider pr-8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPermissions.map((p, index) => (
                  <TableRow key={p.id} className="group hover:bg-orange-50/30 transition-colors border-b border-gray-50 last:border-0">
                    <TableCell className="text-center px-6">
                        <span className="text-[10px] font-bold text-gray-400">{(index + 1).toString().padStart(2, '0')}</span>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                            <Key className="text-primary" size={16} />
                        </div>
                        <span className="font-bold text-[13px] text-gray-900 tracking-tight">{p.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500 font-medium">
                      {p.description || '-'}
                    </TableCell>
                    <TableCell className="text-right pr-8">
                       <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeletePermission(p.id)}
                        className="h-9 w-9 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredPermissions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center text-gray-400 font-medium">
                      No permissions found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
