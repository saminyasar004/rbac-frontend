'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ShieldCheck, Plus, Trash2, Edit3, CheckCircle, XCircle, Key } from 'lucide-react';

interface Permission {
  id: string;
  name: string;
  description: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

export default function RolesPage() {
  const { hasPermission } = useAuthStore();
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchRoles = async () => {
    try {
      const { data } = await api.get('/roles');
      setRoles(data);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    }
  };

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

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/roles', form);
      setForm({ name: '', description: '' });
      setShowCreateDialog(false);
      fetchRoles();
    } catch (error) {
      console.error('Failed to create role:', error);
    }
  };

  const handleDeleteRole = async (id: string) => {
    if (!confirm('Are you sure you want to delete this role?')) return;
    try {
      await api.delete(`/roles/${id}`);
      fetchRoles();
    } catch (error) {
      console.error('Failed to delete role:', error);
    }
  };

  const togglePermission = async (roleId: string, permissionId: string, hasPermission: boolean) => {
    try {
      if (hasPermission) {
        await api.delete(`/roles/${roleId}/permissions/${permissionId}`);
      } else {
        await api.post(`/roles/${roleId}/permissions/${permissionId}`);
      }
      await fetchRoles();
      // Update selectedRole to reflect the changes in the modal
      setRoles(prevRoles => {
        const updatedRole = prevRoles.find(r => r.id === roleId);
        if (updatedRole) setSelectedRole(updatedRole);
        return prevRoles;
      });
    } catch (error) {
      console.error('Failed to toggle permission:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-xs font-bold text-gray-400 tracking-widest uppercase">Loading Roles...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Roles Management</h1>
          <p className="text-sm text-gray-500 font-medium">Define and manage system roles and their associated permissions.</p>
        </div>
        {hasPermission('roles.manage') && (
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 font-bold h-11 px-6 rounded-xl gap-2">
                <Plus size={18} />
                Create Role
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white rounded-2xl p-0 overflow-hidden border-none shadow-2xl">
              <div className="p-8">
                <DialogHeader className="mb-6">
                  <DialogTitle className="text-xl font-bold">Create New Role</DialogTitle>
                  <DialogDescription>Define a new role and assign its base access level.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateRole} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs font-bold text-gray-500 uppercase ml-1">Role Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g. SUPERVISOR"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value.toUpperCase() })}
                      required
                      className="h-12 rounded-xl border-gray-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="description" className="text-xs font-bold text-gray-500 uppercase ml-1">Description</Label>
                    <Input
                      id="description"
                      placeholder="Role description..."
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
                      Save Role
                    </Button>
                  </div>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <Card key={role.id} className="border-none shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300">
            <CardHeader className="bg-white border-b border-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <ShieldCheck className="text-primary" size={24} />
                  </div>
                  <CardTitle className="text-lg font-bold tracking-tight">{role.name}</CardTitle>
                </div>
                {hasPermission('roles.manage') && (
                   <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDeleteRole(role.id)}
                    className="h-9 w-9 text-gray-400 hover:text-red-500 rounded-full"
                    disabled={['ADMIN', 'CUSTOMER'].includes(role.name)}
                  >
                    <Trash2 size={18} />
                  </Button>
                )}
              </div>
              <CardDescription className="mt-2 text-gray-500 font-medium line-clamp-2 min-h-[2.5rem]">
                {role.description || 'No description provided.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Permissions</span>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-none font-bold rounded-lg">
                    {role.permissions?.length || 0}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-1.5 min-h-[4rem] max-h-[8rem] overflow-y-auto pr-2 custom-scrollbar">
                  {role.permissions?.slice(0, 5).map((p) => (
                    <Badge key={p.id} className="bg-orange-50 text-primary border-none text-[10px] font-bold rounded-md px-2 py-0.5">
                      {p.name.split('.').pop()}
                    </Badge>
                  ))}
                  {(role.permissions?.length || 0) > 5 && (
                    <span className="text-[11px] text-gray-400 font-medium self-center ml-1">
                      +{(role.permissions?.length || 0) - 5} more
                    </span>
                  )}
                </div>

                {hasPermission('roles.manage') && (
                  <Button 
                    variant="outline" 
                    className="w-full h-11 rounded-xl border-gray-200 text-sm font-bold hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 group"
                    onClick={() => {
                        setSelectedRole(role);
                        setShowPermissionDialog(true);
                    }}
                  >
                    Manage Access
                    <Edit3 size={16} className="ml-2 opacity-50 group-hover:opacity-100" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Permissions Management Dialog */}
      <Dialog open={showPermissionDialog} onOpenChange={setShowPermissionDialog}>
        <DialogContent className="sm:max-w-2xl bg-white rounded-2xl p-0 overflow-hidden border-none shadow-2xl">
          <div className="p-8">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <Key className="text-primary" size={24} />
                Access Control: {selectedRole?.name}
              </DialogTitle>
              <DialogDescription>
                Assign or revoke permissions for the {selectedRole?.name} role.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar py-2">
              {permissions.map((p) => {
                const isAssigned = selectedRole?.permissions?.some(rp => rp.id === p.id);
                return (
                  <div key={p.id} className="group flex items-start justify-between p-4 border border-gray-100 rounded-2xl hover:bg-orange-50/30 hover:border-orange-100 transition-all duration-200">
                    <div className="flex-1 mr-4 min-w-0">
                      <p className="font-bold text-[13px] text-gray-900 leading-tight mb-1 truncate">{p.name}</p>
                      <p className="text-[11px] text-gray-400 font-medium leading-relaxed line-clamp-2">{p.description}</p>
                    </div>
                    <Button
                      variant={isAssigned ? "default" : "outline"}
                      size="sm"
                      onClick={() => togglePermission(selectedRole!.id, p.id, !!isAssigned)}
                      className={`
                        h-8 rounded-lg text-[11px] font-bold px-3 transition-all duration-300
                        ${isAssigned 
                          ? "bg-green-100 text-green-700 hover:bg-green-200 border-none px-4" 
                          : "border-gray-200 text-gray-400 hover:text-black hover:border-gray-900 shadow-none"}
                      `}
                    >
                      {isAssigned ? "Active" : "Grant"}
                    </Button>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-6">
              <Button variant="ghost" onClick={() => setShowPermissionDialog(false)} className="h-11 rounded-xl font-bold px-8">
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
