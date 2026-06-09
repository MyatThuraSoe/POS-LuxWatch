import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, User } from 'lucide-react';
import { useCustomers } from '@/hooks/useCustomers';
import type { Customer } from '@/types/customer';

interface CustomerSelectorProps {
  selectedCustomer: Customer | null;
  onSelectCustomer: (customer: Customer) => void;
  onClearCustomer: () => void;
}

export const CustomerSelector: React.FC<CustomerSelectorProps> = ({
  selectedCustomer,
  onSelectCustomer,
  onClearCustomer
}) => {
  const { customers, isLoading } = useCustomers();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredCustomers = (customers || []).filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const handleSelect = (customer: Customer) => {
    onSelectCustomer(customer);
    setIsDialogOpen(false);
    setSearchTerm('');
  };

  return (
    <>
      {selectedCustomer ? (
        <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{selectedCustomer.name}</p>
              {selectedCustomer.tags && selectedCustomer.tags.length > 0 && (
                <div className="flex gap-1 mt-1">
                  {selectedCustomer.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          <Button size="sm" variant="ghost" onClick={onClearCustomer}>
            Change
          </Button>
        </div>
      ) : (
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={() => setIsDialogOpen(true)}
        >
          <User className="mr-2 h-4 w-4" />
          Select Customer (optional)
        </Button>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Customer</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
                autoFocus
              />
            </div>
            
            <div className="max-h-64 overflow-auto space-y-2">
              {isLoading ? (
                <div className="text-center py-4 text-muted-foreground">
                  Loading customers...
                </div>
              ) : filteredCustomers.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  {searchTerm ? 'No customers found' : 'No customers available'}
                </div>
              ) : (
                filteredCustomers.map(customer => (
                  <button
                    key={customer.id}
                    className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 text-left"
                    onClick={() => handleSelect(customer)}
                  >
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {customer.email} • {customer.phone}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {customer.tags && customer.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </button>
                ))
              )}
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="outline" onClick={() => {}}>
                <Plus className="mr-2 h-4 w-4" />
                New Customer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
