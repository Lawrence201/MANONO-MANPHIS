"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MoreVertical, Mail, Phone, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { updateClient, deleteClient, createClient } from "@/lib/actions/client-actions";

export function ClientsTable({ initialClients }: { initialClients: any[] }) {
  const [clients, setClients] = useState(initialClients);
  const [search, setSearch] = useState("");
  
  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Current editing client
  const [currentClient, setCurrentClient] = useState<any | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({ name: "", email: "", phoneNumber: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtering
  const filteredClients = clients.filter(c => 
    (c.name || "").toLowerCase().includes(search.toLowerCase()) || 
    (c.email || "").toLowerCase().includes(search.toLowerCase())
  );

  // Handlers
  const openEditModal = (client: any) => {
    setCurrentClient(client);
    setFormData({ name: client.name || "", email: client.email || "", phoneNumber: client.phoneNumber || "" });
    setIsEditModalOpen(true);
  };

  const openCreateModal = () => {
    setFormData({ name: "", email: "", phoneNumber: "" });
    setIsCreateModalOpen(true);
  };

  const openDeleteDialog = (client: any) => {
    setCurrentClient(client);
    setIsDeleteDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    setIsSubmitting(true);
    const res = await updateClient(currentClient.id, formData);
    setIsSubmitting(false);
    
    if (res.success) {
      toast.success("Client updated successfully");
      setClients(clients.map(c => c.id === currentClient.id ? { ...c, ...formData } : c));
      setIsEditModalOpen(false);
    } else {
      toast.error(res.error || "Failed to update client");
    }
  };

  const handleCreateSubmit = async () => {
    setIsSubmitting(true);
    const res = await createClient(formData);
    setIsSubmitting(false);
    
    if (res.success && res.data) {
      toast.success("Client created successfully");
      setClients([res.data, ...clients]);
      setIsCreateModalOpen(false);
    } else {
      toast.error(res.error || "Failed to create client");
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    const res = await deleteClient(currentClient.id);
    setIsSubmitting(false);
    
    if (res.success) {
      toast.success("Client deleted");
      setClients(clients.filter(c => c.id !== currentClient.id));
      setIsDeleteDialogOpen(false);
    } else {
      toast.error(res.error || "Failed to delete client");
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <Input 
          placeholder="Search clients by name or email..." 
          className="max-w-xs h-9 bg-card" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={openCreateModal} size="sm" className="bg-[#6aabfc] hover:bg-[#6aabfc]/90 text-white">Add Client</Button>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border bg-secondary/30">
                <th className="font-medium px-5 py-3">Client</th>
                <th className="font-medium px-5 py-3">Contact</th>
                <th className="font-medium px-5 py-3">Joined Date</th>
                <th className="font-medium px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-muted-foreground">
                    No clients found.
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => {
                  const date = new Date(client.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                  const initials = client.name ? client.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase() : "CL";
                  
                  return (
                    <tr key={client.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-xs font-semibold text-foreground">
                            {initials}
                          </div>
                          <div>
                            <div className="font-medium text-xs">{client.name || "Unknown Name"}</div>
                            <div className="text-[10px] text-muted-foreground">ID: #{client.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="space-y-1">
                          <div className="text-[11px] text-foreground flex items-center gap-1.5"><Mail className="w-3 h-3 text-muted-foreground" />{client.email}</div>
                          {client.phoneNumber && <div className="text-[11px] text-muted-foreground flex items-center gap-1.5"><Phone className="w-3 h-3" />{client.phoneNumber}</div>}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground">{date}</td>
                      <td className="px-5 py-3.5 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="w-4 h-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[140px]">
                            <DropdownMenuItem onClick={() => openEditModal(client)} className="cursor-pointer">
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => openDeleteDialog(client)} className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-xs font-medium">Full Name</label>
              <Input 
                value={formData.name} 
                onChange={e => setFormData({ ...formData, name: e.target.value })} 
                placeholder="John Doe" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium">Email Address</label>
              <Input 
                value={formData.email} 
                onChange={e => setFormData({ ...formData, email: e.target.value })} 
                placeholder="john@example.com" 
                type="email"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium">Phone Number</label>
              <Input 
                value={formData.phoneNumber} 
                onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })} 
                placeholder="+1234567890" 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)} disabled={isSubmitting}>Cancel</Button>
            <Button onClick={handleEditSubmit} disabled={isSubmitting} className="bg-[#6aabfc] hover:bg-[#6aabfc]/90 text-white">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-xs font-medium">Full Name <span className="text-destructive">*</span></label>
              <Input 
                value={formData.name} 
                onChange={e => setFormData({ ...formData, name: e.target.value })} 
                placeholder="John Doe" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium">Email Address <span className="text-destructive">*</span></label>
              <Input 
                value={formData.email} 
                onChange={e => setFormData({ ...formData, email: e.target.value })} 
                placeholder="john@example.com" 
                type="email"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium">Phone Number</label>
              <Input 
                value={formData.phoneNumber} 
                onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })} 
                placeholder="+1234567890" 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)} disabled={isSubmitting}>Cancel</Button>
            <Button 
              onClick={handleCreateSubmit} 
              disabled={isSubmitting || !formData.name || !formData.email}
              className="bg-[#6aabfc] hover:bg-[#6aabfc]/90 text-white"
            >
              Add Client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Client</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-sm text-muted-foreground">
            Are you sure you want to delete <strong>{currentClient?.name}</strong>? This action cannot be undone and will permanently remove the client from the database.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isSubmitting}>Cancel</Button>
            <Button onClick={handleDelete} disabled={isSubmitting} variant="destructive">Delete Client</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
