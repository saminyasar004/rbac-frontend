'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ShieldCheck, Menu, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  role?: {
    id: string;
    name: string;
  };
  managerId?: string;
  manager?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

interface Role {
  id: string;
  name: string;
  description: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
}

export default function UsersPage() {
  const { hasPermission } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false);

  const [createForm, setCreateForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    roleId: '',
    managerId: '',
  });

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await api.get('/roles');
      setRoles(response.data);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await api.get('/permissions');
      setPermissions(response.data);
    } catch (error) {
      console.error('Failed to fetch permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Normalize managerId and roleId for submission
      const payload = {
        ...createForm,
        roleId: createForm.roleId || undefined,
        managerId: createForm.managerId === 'null' ? null : createForm.managerId || null,
      };
      
      await api.post('/auth/register', payload);
      setShowCreateDialog(false);
      setCreateForm({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        roleId: '',
        managerId: '',
      });
      await fetchUsers();
    } catch (error) {
      console.error('Failed to create user:', error);
    } finally {
      setLoading(false);
    }
  };

  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (userId: string, status: string) => {
    setUpdatingId(userId);
    try {
      await api.patch(`/users/${userId}/status`, { status });
      await fetchUsers();
    } catch (error) {
      console.error('Failed to update user status:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRoleChange = async (userId: string, roleId: string) => {
    setUpdatingId(userId);
    try {
      await api.patch(`/users/${userId}`, { roleId });
      await fetchUsers();
    } catch (error) {
      console.error('Failed to update user role:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter potential managers (admins and managers)
  const potentialManagers = users.filter(u => 
    ['ADMIN', 'MANAGER'].includes(u.role?.name || '')
  );

  if (loading && users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-xs font-bold text-gray-400 tracking-widest uppercase">Loading Users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">User Management</h1>
          <p className="text-sm text-gray-500 font-medium">Manage users, roles, and permissions in your system</p>
        </div>
        {hasPermission('users.create') && (
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 font-bold h-11 px-6 rounded-xl gap-2">
                <Plus size={18} />
                Add New User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md w-[calc(100%-2rem)] rounded-2xl p-0 overflow-hidden border-none shadow-2xl">
              <div className="p-6 md:p-8">
                <DialogHeader className="mb-6">
                  <DialogTitle className="text-xl font-bold">Create New User</DialogTitle>
                  <DialogDescription className="text-gray-500">
                    Add a new user to the system with appropriate role and permissions.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateUser} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="firstName" className="text-xs font-bold text-gray-500 uppercase ml-1">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={createForm.firstName}
                        onChange={(e) => setCreateForm({ ...createForm, firstName: e.target.value })}
                        required
                        className="h-12 rounded-xl border-gray-200 focus:border-primary focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="lastName" className="text-xs font-bold text-gray-500 uppercase ml-1">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={createForm.lastName}
                        onChange={(e) => setCreateForm({ ...createForm, lastName: e.target.value })}
                        required
                        className="h-12 rounded-xl border-gray-200 focus:border-primary focus:ring-primary"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-bold text-gray-500 uppercase ml-1">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      value={createForm.email}
                      onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                      required
                      className="h-12 rounded-xl border-gray-200 focus:border-primary focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-xs font-bold text-gray-500 uppercase ml-1">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={createForm.password}
                      onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                      required
                      className="h-12 rounded-xl border-gray-200 focus:border-primary focus:ring-primary"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="roleId" className="text-xs font-bold text-gray-500 uppercase ml-1">Assign Role</Label>
                      <Select value={createForm.roleId} onValueChange={(value) => setCreateForm({ ...createForm, roleId: value })}>
                        <SelectTrigger className="h-12 rounded-xl border-gray-200">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-gray-200">
                          {roles.map((role) => (
                            <SelectItem key={role.id} value={role.id} className="rounded-lg">
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="managerId" className="text-xs font-bold text-gray-500 uppercase ml-1">Reports To</Label>
                      <Select value={createForm.managerId || 'null'} onValueChange={(value) => setCreateForm({ ...createForm, managerId: value })}>
                        <SelectTrigger className="h-12 rounded-xl border-gray-200">
                          <SelectValue placeholder="No manager" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-gray-200">
                          <SelectItem value="null" className="font-bold text-gray-400">Independent / None</SelectItem>
                          {potentialManagers.map((m) => (
                            <SelectItem key={m.id} value={m.id} className="rounded-lg">
                              {m.firstName} {m.lastName} ({m.role?.name})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6">
                    <Button type="button" variant="ghost" onClick={() => setShowCreateDialog(false)} className="h-12 rounded-xl font-bold">
                      Cancel
                    </Button>
                    <Button 
                        type="submit" 
                        disabled={loading}
                        className="h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold px-8 shadow-lg shadow-primary/20"
                    >
                      {loading ? 'Creating...' : 'Create User'}
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
          <CardTitle className="text-lg font-bold">System Users</CardTitle>
          <CardDescription>A complete list of users and their access levels.</CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto w-full scrollbar-hide">
            <div className="inline-block min-w-full align-middle">
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow className="hover:bg-transparent border-b border-gray-100">
                    <TableHead className="w-[80px] py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Avatar</TableHead>
                    <TableHead className="py-4 font-bold text-gray-700 uppercase text-[11px] tracking-wider">User Details</TableHead>
                    <TableHead className="font-bold text-gray-700 uppercase text-[11px] tracking-wider">Role</TableHead>
                    <TableHead className="font-bold text-gray-700 uppercase text-[11px] tracking-wider">Status</TableHead>
                    <TableHead className="font-bold text-gray-700 uppercase text-[11px] tracking-wider">Manager</TableHead>
                    <TableHead className="text-right py-4 font-bold text-gray-700 uppercase text-[11px] tracking-wider pr-6 md:pr-8">Edit Access</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="group hover:bg-orange-50/30 transition-colors border-b border-gray-50">
                       <TableCell className="px-6">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm border-2 border-white mx-auto">
                            {user.firstName[0]}{user.lastName[0]}
                          </div>
                      </TableCell>
                      <TableCell className="py-4 font-medium">
                          <div className="flex flex-col">
                            <span className="text-gray-900 font-bold text-[14px]">
                              {user.firstName} {user.lastName}
                            </span>
                            <span className="text-gray-400 text-xs font-medium">{user.email}</span>
                          </div>
                      </TableCell>
                      <TableCell>
                        {user.role ? (
                          <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-none font-bold rounded-lg px-2.5 py-0.5 text-[10px] uppercase tracking-wider">
                            {user.role.name}
                          </Badge>
                        ) : (
                          <span className="text-gray-300 text-xs font-medium italic">Unassigned</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`
                            border-none font-bold rounded-lg px-2.5 py-0.5 text-[10px] uppercase tracking-wider
                            ${user.status === 'ACTIVE' 
                              ? 'bg-green-100 text-green-700' 
                              : user.status === 'SUSPENDED'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'}
                          `}
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-500 font-medium text-sm">
                        {user.manager ? (
                          <div className="flex items-center gap-2">
                             <div className="w-6 h-6 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600">
                                {user.manager.firstName[0]}{user.manager.lastName[0]}
                             </div>
                             <span className="text-xs font-bold text-gray-700">{user.manager.firstName} {user.manager.lastName}</span>
                          </div>
                        ) : (
                          <span className="text-gray-300 text-xs">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right py-4 pr-6 md:pr-8">
                        <div className="flex items-center justify-end gap-2">
                          {hasPermission('users.edit') && (
                            <div className="hidden md:flex gap-2">
                              <Select
                                disabled={updatingId === user.id}
                                value={user.role?.id || ''}
                                onValueChange={(roleId) => handleRoleChange(user.id, roleId)}
                              >
                                <SelectTrigger className="w-32 h-9 rounded-lg text-xs font-bold border-gray-100 shadow-sm focus:ring-0">
                                  <SelectValue placeholder="Role" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl shadow-xl border-gray-100">
                                  {roles.map((role) => (
                                    <SelectItem key={role.id} value={role.id} className="text-xs font-medium rounded-lg">
                                      {role.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>

                              <Select
                                disabled={updatingId === user.id}
                                value={user.status}
                                onValueChange={(status) => handleStatusChange(user.id, status)}
                              >
                                <SelectTrigger className="w-28 h-9 rounded-lg text-xs font-bold border-gray-100 shadow-sm focus:ring-0">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl shadow-xl border-gray-100">
                                  <SelectItem value="ACTIVE" className="text-xs font-medium rounded-lg">Active</SelectItem>
                                  <SelectItem value="SUSPENDED" className="text-xs font-medium rounded-lg">Suspended</SelectItem>
                                  <SelectItem value="BANNED" className="text-xs font-medium rounded-lg text-red-600">Banned</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          {hasPermission('permissions.manage') && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-primary border-primary/20 hover:bg-primary/5 font-bold text-xs rounded-lg px-4"
                              onClick={() => {
                                setSelectedUser(user);
                                setShowPermissionsDialog(true);
                              }}
                            >
                              Edit Access
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Permissions Dialog */}
      <Dialog open={showPermissionsDialog} onOpenChange={setShowPermissionsDialog}>
        <DialogContent className="sm:max-w-2xl w-[calc(100%-2rem)] rounded-2xl p-0 overflow-hidden border-none shadow-2xl">
          <div className="p-6 md:p-8">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <ShieldCheck className="text-primary" size={24} />
                Manage Specific Permissions
              </DialogTitle>
              <DialogDescription className="text-gray-500">
                Grant extra permissions to <span className="font-bold text-gray-900">{selectedUser?.firstName} {selectedUser?.lastName}</span> beyond their role.
              </DialogDescription>
            </DialogHeader>
            {selectedUser && <PermissionsTab user={selectedUser} permissions={permissions} />}
            <div className="flex justify-end pt-6">
              <Button variant="ghost" onClick={() => setShowPermissionsDialog(false)} className="h-11 rounded-xl font-bold px-8">
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PermissionsTab({ user, permissions }: { user: User; permissions: Permission[] }) {
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserPermissions();
  }, [user.id]);

  const fetchUserPermissions = async () => {
    try {
      const response = await api.get(`/users/${user.id}/permissions`);
      setUserPermissions(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch user permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const [togglingId, setTogglingId] = useState<string | null>(null);

  const togglePermission = async (permissionId: string, permissionName: string, hasPermission: boolean) => {
    setTogglingId(permissionId);
    try {
      if (hasPermission) {
        await api.delete(`/users/${user.id}/permissions/${permissionId}`);
      } else {
        await api.post(`/users/${user.id}/permissions/${permissionId}`);
      }
      // Re-fetch to ensure sync with backend
      await fetchUserPermissions();
    } catch (error: any) {
      console.error('Failed to toggle permission:', error);
      // If already granted, just refresh to sync UI
      if (error.response?.status === 400) {
        await fetchUserPermissions();
      }
    } finally {
      setTogglingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Access...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {permissions.map((permission) => {
          const isGranted = userPermissions.includes(permission.name);
          const isWorking = togglingId === permission.id;

          return (
            <div key={permission.id} className="group flex items-start justify-between p-4 border border-gray-100 rounded-2xl hover:bg-orange-50/30 hover:border-orange-100 transition-all duration-200">
              <div className="flex-1 mr-4 min-w-0">
                <p className="font-bold text-[13px] text-gray-900 leading-tight mb-1 truncate">{permission.name}</p>
                <p className="text-[11px] text-gray-400 font-medium leading-relaxed line-clamp-2">{permission.description}</p>
              </div>
              <Button
                variant={isGranted ? "default" : "outline"}
                size="sm"
                disabled={isWorking}
                onClick={() => togglePermission(permission.id, permission.name, isGranted)}
                className={`
                  h-8 rounded-lg text-[11px] font-bold px-3 min-w-[70px] transition-all duration-300
                  ${isGranted 
                    ? "bg-green-100 text-green-700 hover:bg-green-200 border-none px-4" 
                    : "border-gray-200 text-gray-400 hover:text-black hover:border-gray-900 shadow-none"}
                  ${isWorking ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                {isWorking ? "..." : isGranted ? "Active" : "Grant"}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
