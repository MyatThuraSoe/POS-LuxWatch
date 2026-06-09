import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSupplier, useDeleteSupplier, useSupplierContacts, useDeleteContact } from "@/hooks/useSuppliers";
import { toast } from "sonner";
import type { SupplierContact } from "@/types/supplier";

export function SupplierDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const supplierId = id ? parseInt(id) : 0;
  
  const { data: supplier, isLoading } = useSupplier(supplierId);
  const { data: contacts } = useSupplierContacts(supplierId);
  const deleteMutation = useDeleteSupplier();
  const deleteContactMutation = useDeleteContact(supplierId);

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${supplier?.name}?`)) {
      deleteMutation.mutate(supplierId, {
        onSuccess: () => {
          toast.success("Supplier deleted successfully");
          navigate("/suppliers");
        },
        onError: () => {
          toast.error("Failed to delete supplier");
        },
      });
    }
  };

  const handleDeleteContact = (contact: SupplierContact) => {
    if (confirm(`Delete contact ${contact.name}?`)) {
      deleteContactMutation.mutate(contact.id, {
        onSuccess: () => {
          toast.success("Contact deleted successfully");
        },
        onError: () => {
          toast.error("Failed to delete contact");
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading supplier details...</p>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Supplier not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={supplier.name}
        description="Supplier details and contacts"
      >
        <div className="flex gap-2">
          <Button variant="default" onClick={() => navigate("/suppliers")}>
            Back to List
          </Button>
          <Button onClick={() => navigate(`/suppliers/${supplierId}/edit`)}>
            Edit Supplier
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </PageHeader>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Supplier Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Code</p>
                <p className="font-medium">{supplier.code || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={supplier.status === "active" ? "default" : "secondary"}>
                  {supplier.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{supplier.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{supplier.phone || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mobile</p>
                <p className="font-medium">{supplier.mobile || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Website</p>
                <p className="font-medium">{supplier.website || "N/A"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{supplier.address || "N/A"}</p>
              </div>
              {supplier.city && (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">City</p>
                    <p className="font-medium">{supplier.city}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">State</p>
                    <p className="font-medium">{supplier.state || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Country</p>
                    <p className="font-medium">{supplier.country || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Postal Code</p>
                    <p className="font-medium">{supplier.postalCode || "N/A"}</p>
                  </div>
                </>
              )}
              {supplier.taxNumber && (
                <div>
                  <p className="text-sm text-muted-foreground">Tax Number</p>
                  <p className="font-medium">{supplier.taxNumber}</p>
                </div>
              )}
              {supplier.paymentTerms && (
                <div>
                  <p className="text-sm text-muted-foreground">Payment Terms</p>
                  <p className="font-medium">{supplier.paymentTerms}</p>
                </div>
              )}
              {supplier.notes && (
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="font-medium">{supplier.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Contacts</CardTitle>
            <Button size="sm" onClick={() => navigate(`/suppliers/${supplierId}/contacts`)}>
              Add Contact
            </Button>
          </CardHeader>
          <CardContent>
            {contacts && contacts.length > 0 ? (
              <div className="space-y-4">
                {contacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-muted-foreground">{contact.title || "Contact"}</p>
                      <p className="text-sm">{contact.email || contact.phone || "No contact info"}</p>
                    </div>
                    <div className="flex gap-2">
                      {contact.isPrimary && <Badge variant="default">Primary</Badge>}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteContact(contact)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No contacts added yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
