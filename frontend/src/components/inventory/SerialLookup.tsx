import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { SerialNumber } from "@/types/inventory";

interface SerialLookupProps {
  // Compatibility: support either a list of serials OR a lookup callback/result
  serials?: SerialNumber[];
  onLookup?: (serial: string) => void;
  result?: SerialNumber | null;
  isLoading?: boolean;
}

const statusColors: Record<SerialNumber['status'], string> = {
  available: 'bg-green-100 text-green-800',
  sold: 'bg-gray-100 text-gray-800',
  reserved: 'bg-yellow-100 text-yellow-800',
  repair: 'bg-orange-100 text-orange-800',
  warranty: 'bg-blue-100 text-blue-800',
};

export function SerialLookup({ serials, onLookup, result, isLoading }: SerialLookupProps) {
  // If `serials` prop is passed, render a simple list view, otherwise render lookup UI
  if (serials) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold mb-2">Serials</h3>
          <div className="grid gap-2">
            {serials.length === 0 ? (
              <p className="text-sm text-muted-foreground">No serials found.</p>
            ) : (
              serials.map((s) => (
                <div key={s.serialNumber} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{s.serialNumber}</p>
                    <p className="text-sm text-muted-foreground">{s.productName}</p>
                  </div>
                  <Badge className={statusColors[s.status]}>{s.status}</Badge>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() && onLookup) {
      onLookup(searchTerm.trim());
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter serial number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading}>
          <Search className="h-4 w-4 mr-2" />
          Lookup
        </Button>
      </form>

      {result && (
        <div className="rounded-lg border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">{result.serialNumber}</h3>
            <Badge className={statusColors[result.status]}>
              {result.status}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Product:</span>
              <p className="font-medium">{result.productName}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Status:</span>
              <p className="font-medium capitalize">{result.status}</p>
            </div>
            {result.purchaseDate && (
              <div>
                <span className="text-muted-foreground">Purchase Date:</span>
                <p className="font-medium">
                  {new Date(result.purchaseDate).toLocaleDateString()}
                </p>
              </div>
            )}
            {result.warrantyExpiryDate && (
              <div>
                <span className="text-muted-foreground">Warranty Expires:</span>
                <p className="font-medium">
                  {new Date(result.warrantyExpiryDate).toLocaleDateString()}
                </p>
              </div>
            )}
            {result.supplierName && (
              <div>
                <span className="text-muted-foreground">Supplier:</span>
                <p className="font-medium">{result.supplierName}</p>
              </div>
            )}
            {result.notes && (
              <div className="col-span-2">
                <span className="text-muted-foreground">Notes:</span>
                <p className="font-medium">{result.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
