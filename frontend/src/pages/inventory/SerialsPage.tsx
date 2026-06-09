import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { SerialLookup } from "@/components/inventory";
import { useSerialNumbers, useSerialLookup } from "@/hooks/useInventory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

export function SerialsPage() {
  const navigate = useNavigate();
  const [searchSerial, setSearchSerial] = useState("");
  const [filters, setFilters] = useState<Record<string, unknown>>({});
  
  const { data: serials } = useSerialNumbers(filters);
  const { data: lookupResult, isLoading: isLookingUp } = useSerialLookup(searchSerial);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Trigger lookup via hook
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Serial Number Lookup"
        description="Search and track products by serial number"
      >
        <Button variant="outline" onClick={() => navigate("/inventory")}>
          Back to Inventory
        </Button>
      </PageHeader>

      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          placeholder="Enter serial number to lookup..."
          value={searchSerial}
          onChange={(e) => setSearchSerial(e.target.value)}
          className="max-w-md"
        />
        <Button type="submit" disabled={isLookingUp || !searchSerial}>
          {isLookingUp ? "Searching..." : "Lookup"}
        </Button>
      </form>

      {lookupResult && (
        <div className="bg-card rounded-lg border p-4">
          <h3 className="text-lg font-semibold mb-2">Lookup Result</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Product</p>
              <p className="font-medium">{lookupResult.productName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Serial Number</p>
              <p className="font-medium">{lookupResult.serialNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium capitalize">{lookupResult.status}</p>
            </div>
            {lookupResult.warrantyExpiryDate && (
              <div>
                <p className="text-sm text-muted-foreground">Warranty Expires</p>
                <p className="font-medium">{lookupResult.warrantyExpiryDate}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <SerialLookup
        serials={serials || []}
        isLoading={!serials}
      />
    </div>
  );
}
