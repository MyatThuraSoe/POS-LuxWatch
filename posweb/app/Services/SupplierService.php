<?php

namespace App\Services;

use App\Models\Supplier;
use App\Models\SupplierContact;
use Illuminate\Support\Facades\DB;

class SupplierService extends BaseService
{
    public function getAll(array $filters = [])
    {
        $query = Supplier::query()->withCount('contacts');

        if (isset($filters['search'])) {
            $query->where('company_name', 'ilike', "%{$filters['search']}%");
        }

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->orderBy('company_name')->paginate(15);
    }

    public function findById(int $id): Supplier
    {
        return Supplier::with(['contacts', 'purchaseOrders'])->findOrFail($id);
    }

    public function create(array $data): Supplier
    {
        return DB::transaction(function () use ($data) {
            $contacts = $data['contacts'] ?? [];
            unset($data['contacts']);

            $supplier = Supplier::create($data);

            foreach ($contacts as $contactData) {
                $contactData['supplier_id'] = $supplier->id;
                SupplierContact::create($contactData);
            }

            $this->audit('created', $supplier, 'supplier');
            return $supplier;
        });
    }

    public function update(int $id, array $data): Supplier
    {
        return DB::transaction(function () use ($id, $data) {
            $supplier = Supplier::findOrFail($id);
            $supplier->update($data);
            $this->audit('updated', $supplier, 'supplier');
            return $supplier->fresh();
        });
    }

    public function delete(int $id): void
    {
        DB::transaction(function () use ($id) {
            $supplier = Supplier::findOrFail($id);
            
            // Check if has purchase history
            if ($supplier->purchaseOrders()->count() > 0) {
                throw new \Exception('Cannot delete supplier with purchase history. Use soft delete instead.');
            }
            
            $this->audit('deleted', $supplier, 'supplier');
            $supplier->delete();
        });
    }

    public function addContact(int $supplierId, array $data): SupplierContact
    {
        return DB::transaction(function () use ($supplierId, $data) {
            $data['supplier_id'] = $supplierId;
            
            // If primary, unset other primaries
            if (!empty($data['is_primary'])) {
                SupplierContact::where('supplier_id', $supplierId)->update(['is_primary' => false]);
            }
            
            $contact = SupplierContact::create($data);
            return $contact;
        });
    }

    public function getPurchaseHistory(int $supplierId): array
    {
        $supplier = Supplier::findOrFail($supplierId);
        
        return [
            'total_orders' => $supplier->purchaseOrders()->count(),
            'total_spent' => $supplier->purchaseOrders()->sum('total_amount'),
            'average_lead_time' => $supplier->lead_time_days,
            'recent_orders' => $supplier->purchaseOrders()
                ->with('items')
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get(),
        ];
    }
}
