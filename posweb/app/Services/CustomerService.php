<?php

namespace App\Services;

use App\Models\Customer;

class CustomerService
{
    public function create(array $data): Customer
    {
        return Customer::create($data);
    }

    public function update(Customer $customer, array $data): Customer
    {
        $customer->update($data);
        return $customer->fresh();
    }

    public function getWithHistory(int $customerId): Customer
    {
        return Customer::with([
            'sales.items.variant.product.brand',
            'warranties.serial.variant.product'
        ])->findOrFail($customerId);
    }

    public function search(string $query, int $perPage = 20)
    {
        return Customer::where('name', 'like', "%{$query}%")
            ->orWhere('email', 'like', "%{$query}%")
            ->orWhere('phone', 'like', "%{$query}%")
            ->orderBy('name')
            ->paginate($perPage);
    }
}
