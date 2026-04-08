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

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: string;
  notes?: string;
  assignedTo?: string;
  assignedUser?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdBy: string;
  creator: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export default function LeadsPage() {
  const { hasPermission, user } = useAuthStore();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    notes: '',
  });

  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: '',
    notes: '',
    assignedTo: '',
  });

  useEffect(() => {
    fetchLeads();
    fetchUsers();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await api.get('/leads');
      setLeads(response.data);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/leads', createForm);
      setShowCreateDialog(false);
      setCreateForm({
        name: '',
        email: '',
        phone: '',
        company: '',
        notes: '',
      });
      fetchLeads();
    } catch (error) {
      console.error('Failed to create lead:', error);
    }
  };

  const handleEditLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;

    try {
      await api.patch(`/leads/${selectedLead.id}`, editForm);
      setShowEditDialog(false);
      setSelectedLead(null);
      fetchLeads();
    } catch (error) {
      console.error('Failed to update lead:', error);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;

    try {
      await api.delete(`/leads/${leadId}`);
      fetchLeads();
    } catch (error) {
      console.error('Failed to delete lead:', error);
    }
  };

  const handleAssignLead = async (leadId: string, userId: string) => {
    try {
      await api.patch(`/leads/${leadId}/assign`, { userId });
      fetchLeads();
    } catch (error) {
      console.error('Failed to assign lead:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-100 text-blue-800';
      case 'CONTACTED':
        return 'bg-yellow-100 text-yellow-800';
      case 'QUALIFIED':
        return 'bg-purple-100 text-purple-800';
      case 'CONVERTED':
        return 'bg-green-100 text-green-800';
      case 'LOST':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const openEditDialog = (lead: Lead) => {
    setSelectedLead(lead);
    setEditForm({
      name: lead.name,
      email: lead.email,
      phone: lead.phone || '',
      company: lead.company || '',
      status: lead.status,
      notes: lead.notes || '',
      assignedTo: lead.assignedTo || '',
    });
    setShowEditDialog(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8A65]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Lead Management</h1>
          <p className="text-sm text-gray-500 font-medium">Track and manage your sales pipeline leads</p>
        </div>
        {hasPermission('leads.manage') && (
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 font-bold h-11 px-6 rounded-xl">
                Add New Lead
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md w-[calc(100%-2rem)] rounded-2xl p-0 overflow-hidden border-none shadow-2xl">
              <div className="p-6 md:p-8">
                <DialogHeader className="mb-6">
                  <DialogTitle className="text-xl font-bold">Create New Lead</DialogTitle>
                  <DialogDescription className="text-gray-500">
                    Add a new sales lead to track potential customers.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateLead} className="space-y-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs font-bold text-gray-500 uppercase ml-1">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={createForm.name}
                      onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                      required
                      className="h-12 rounded-xl border-gray-200 focus:border-primary focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-bold text-gray-500 uppercase ml-1">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@company.com"
                      value={createForm.email}
                      onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                      required
                      className="h-12 rounded-xl border-gray-200 focus:border-primary focus:ring-primary"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-xs font-bold text-gray-500 uppercase ml-1">Phone</Label>
                      <Input
                        id="phone"
                        placeholder="+1 (555) 000-0000"
                        value={createForm.phone}
                        onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                        className="h-12 rounded-xl border-gray-200 focus:border-primary focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="company" className="text-xs font-bold text-gray-500 uppercase ml-1">Company</Label>
                      <Input
                        id="company"
                        placeholder="Acme Corp"
                        value={createForm.company}
                        onChange={(e) => setCreateForm({ ...createForm, company: e.target.value })}
                        className="h-12 rounded-xl border-gray-200 focus:border-primary focus:ring-primary"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="notes" className="text-xs font-bold text-gray-500 uppercase ml-1">Initial Notes</Label>
                    <Input
                      id="notes"
                      placeholder="Interested in premium plan..."
                      value={createForm.notes}
                      onChange={(e) => setCreateForm({ ...createForm, notes: e.target.value })}
                      className="h-12 rounded-xl border-gray-200 focus:border-primary focus:ring-primary"
                    />
                  </div>
                  <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6">
                    <Button type="button" variant="ghost" onClick={() => setShowCreateDialog(false)} className="h-12 rounded-xl font-bold">
                      Cancel
                    </Button>
                    <Button type="submit" className="h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold px-8 shadow-lg shadow-primary/20">
                      Create Lead
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
          <CardTitle className="text-lg font-bold">All Pipeline Leads</CardTitle>
          <CardDescription>Comprehensive overview of your sales pipeline.</CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto w-full scrollbar-hide">
             <div className="inline-block min-w-full align-middle">
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow className="hover:bg-transparent border-b border-gray-100">
                    <TableHead className="w-[200px] py-4 font-bold text-gray-700 uppercase text-[11px] tracking-wider pl-6">Lead</TableHead>
                    <TableHead className="font-bold text-gray-700 uppercase text-[11px] tracking-wider">Company</TableHead>
                    <TableHead className="font-bold text-gray-700 uppercase text-[11px] tracking-wider">Status</TableHead>
                    <TableHead className="font-bold text-gray-700 uppercase text-[11px] tracking-wider">Assigned To</TableHead>
                    <TableHead className="font-bold text-gray-700 uppercase text-[11px] tracking-wider">Created</TableHead>
                    <TableHead className="text-right py-4 font-bold text-gray-700 uppercase text-[11px] tracking-wider pr-6 md:pr-8">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow key={lead.id} className="group hover:bg-orange-50/30 transition-colors border-b border-gray-50">
                      <TableCell className="py-4 font-medium pl-6">
                        <div className="flex flex-col">
                          <span className="text-gray-900 font-bold text-[14px]">{lead.name}</span>
                          <span className="text-gray-400 text-xs font-medium">{lead.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600 font-semibold text-sm">
                        {lead.company || <span className="text-gray-300 font-normal italic">N/A</span>}
                      </TableCell>
                      <TableCell>
                        <Badge className={`border-none font-bold rounded-lg px-2.5 py-0.5 text-xs ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {lead.assignedUser ? (
                          <div className="flex items-center gap-2">
                             <div className="w-6 h-6 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600 shadow-sm">
                                {lead.assignedUser.firstName[0]}{lead.assignedUser.lastName[0]}
                             </div>
                             <span className="text-gray-700 font-medium text-sm">{lead.assignedUser.firstName} {lead.assignedUser.lastName}</span>
                          </div>
                        ) : (
                          <span className="text-gray-300 text-xs italic">Unassigned</span>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-500 font-medium text-sm">
                        {new Date(lead.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                      </TableCell>
                      <TableCell className="text-right py-4 pr-6 md:pr-8">
                        <div className="flex items-center justify-end gap-2">
                          {hasPermission('leads.manage') && (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-500 hover:text-black font-bold text-xs rounded-lg px-3 h-8"
                                onClick={() => openEditDialog(lead)}
                              >
                                Edit
                              </Button>

                              <Select
                                value={lead.assignedTo || ''}
                                onValueChange={(userId) => handleAssignLead(lead.id, userId)}
                              >
                                <SelectTrigger className="hidden md:flex w-36 h-8 rounded-lg text-xs font-bold border-gray-100 shadow-sm focus:ring-0">
                                  <SelectValue placeholder="Assigning..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl shadow-xl border-gray-100">
                                  <SelectItem value="" className="text-xs font-medium rounded-lg">Unassign</SelectItem>
                                  {users.map((u) => (
                                    <SelectItem key={u.id} value={u.id} className="text-xs font-medium rounded-lg">
                                      {u.firstName} {u.lastName}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>

                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:text-red-600 hover:bg-red-50 font-bold text-xs rounded-lg px-3 h-8"
                                onClick={() => handleDeleteLead(lead.id)}
                              >
                                Delete
                              </Button>
                            </div>
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

      {/* Edit Lead Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Lead</DialogTitle>
            <DialogDescription>
              Update lead information and status.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditLead} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-company">Company</Label>
              <Input
                id="edit-company"
                value={editForm.company}
                onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={editForm.status}
                onValueChange={(value) => setEditForm({ ...editForm, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NEW">New</SelectItem>
                  <SelectItem value="CONTACTED">Contacted</SelectItem>
                  <SelectItem value="QUALIFIED">Qualified</SelectItem>
                  <SelectItem value="CONVERTED">Converted</SelectItem>
                  <SelectItem value="LOST">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-notes">Notes</Label>
              <Input
                id="edit-notes"
                value={editForm.notes}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-linear-to-r from-[#FF8A65] to-[#FF7043]">
                Update Lead
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}