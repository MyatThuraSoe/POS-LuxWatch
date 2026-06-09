import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactForm } from "@/components/suppliers";
import { useSupplier, useAddContact, useUpdateContact, useSupplierContacts } from "@/hooks/useSuppliers";
import { toast } from "sonner";
import type { SupplierContact } from "@/types/supplier";

export function ManageContactsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const supplierId = id ? parseInt(id) : 0;
  
  const { data: supplier } = useSupplier(supplierId);
  const { data: contacts } = useSupplierContacts(supplierId);
  const addMutation = useAddContact(supplierId);
  const updateMutation = useUpdateContact(supplierId);
  
  const [editingContact, setEditingContact] = useState<SupplierContact | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (data: Partial<SupplierContact>) => {
    if (editingContact) {
      updateMutation.mutate({ contactId: editingContact.id, data }, {
        onSuccess: () => {
          toast.success("Contact updated successfully");
          setEditingContact(null);
        },
        onError: () => {
          toast.error("Failed to update contact");
        },
      });
    } else {
      addMutation.mutate(data as Partial<SupplierContact>, {
        onSuccess: () => {
          toast.success("Contact added successfully");
          setIsAdding(false);
        },
        onError: () => {
          toast.error("Failed to add contact");
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Manage Contacts - ${supplier?.name || ""}`}
        description="Add and manage supplier contacts"
      >
        <Button variant="outline" onClick={() => navigate(`/suppliers/${supplierId}`)}>
          Back to Details
        </Button>
      </PageHeader>

      {!isAdding && !editingContact && (
        <div className="flex justify-end">
          <Button onClick={() => setIsAdding(true)}>
            Add New Contact
          </Button>
        </div>
      )}

      {(isAdding || editingContact) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingContact ? "Edit Contact" : "Add New Contact"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ContactForm
              onSubmit={handleSubmit}
              isLoading={addMutation.isPending || updateMutation.isPending}
              initialData={editingContact || undefined}
              onCancel={() => {
                setIsAdding(false);
                setEditingContact(null);
              }}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Existing Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          {contacts && contacts.length > 0 ? (
            <div className="space-y-4">
              {contacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-muted-foreground">{contact.title || "Contact"}</p>
                    <div className="flex gap-4 mt-1">
                      {contact.email && <p className="text-sm">{contact.email}</p>}
                      {contact.phone && <p className="text-sm">{contact.phone}</p>}
                      {contact.mobile && <p className="text-sm">{contact.mobile}</p>}
                    </div>
                    {contact.notes && <p className="text-sm text-muted-foreground mt-1">{contact.notes}</p>}
                  </div>
                  <div className="flex gap-2">
                    {contact.isPrimary && <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">Primary</span>}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingContact(contact)}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No contacts added yet. Click "Add New Contact" to get started.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
