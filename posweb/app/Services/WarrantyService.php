<?php

namespace App\Services;

use App\Models\Warranty;
use App\Models\WarrantyClaim;
use App\Models\RepairJob;
use App\Models\Sale;
use App\Models\SerialNumber;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class WarrantyService
{
    public function generateForSale(Sale $sale): void
    {
        DB::transaction(function () use ($sale) {
            foreach ($sale->items as $item) {
                $product = $item->variant->product;
                $warrantyMonths = $product->warranty_months ?? 0;

                if ($warrantyMonths <= 0 || !$item->serial) {
                    continue;
                }

                $existing = Warranty::where('serial_id', $item->serial_id)->first();
                if ($existing) {
                    continue;
                }

                Warranty::create([
                    'sale_id' => $sale->id,
                    'serial_id' => $item->serial_id,
                    'customer_id' => $sale->customer_id,
                    'start_date' => $sale->completed_at ?? now(),
                    'end_date' => (clone ($sale->completed_at ?? now()))->addMonths($warrantyMonths),
                    'status' => 'active',
                    'terms' => $product->warranty_terms ?? null,
                ]);
            }
        });
    }

    public function getBySerial(string $serialCode): ?Warranty
    {
        $serial = SerialNumber::where('serial_code', $serialCode)->first();
        if (!$serial) {
            return null;
        }

        return Warranty::where('serial_id', $serial->id)
            ->with(['sale', 'serial.variant.product', 'customer', 'claims.repairJob'])
            ->latest()
            ->first();
    }

    public function validateClaim(Warranty $warranty): array
    {
        $isValid = $warranty->canClaim();
        $reasons = [];

        if (!$isValid) {
            if ($warranty->isExpired()) {
                $reasons[] = 'Warranty has expired';
            }
            if ($warranty->status === 'void') {
                $reasons[] = 'Warranty has been voided';
            }
            if ($warranty->status === 'claimed') {
                $reasons[] = 'Warranty already claimed';
            }
        }

        $activeClaim = $warranty->claims()->where('status', 'pending')->exists();
        if ($activeClaim) {
            $isValid = false;
            $reasons[] = 'Active claim already exists for this item';
        }

        return [
            'valid' => $isValid,
            'reasons' => $reasons,
            'warranty' => $warranty,
        ];
    }

    public function submitClaim(Warranty $warranty, User $user, string $reason, ?string $customerDescription = null): WarrantyClaim
    {
        $validation = $this->validateClaim($warranty);

        if (!$validation['valid']) {
            throw new \InvalidArgumentException(implode(', ', $validation['reasons']));
        }

        return DB::transaction(function () use ($warranty, $user, $reason, $customerDescription) {
            $claim = WarrantyClaim::create([
                'warranty_id' => $warranty->id,
                'reason' => $reason,
                'customer_description' => $customerDescription,
                'submitted_by' => $user->id,
            ]);

            $warranty->update(['status' => 'claimed']);

            return $claim;
        });
    }

    public function approveClaim(WarrantyClaim $claim, ?User $technician = null): RepairJob
    {
        return DB::transaction(function () use ($claim, $technician) {
            $claim->approve();

            return RepairJob::create([
                'claim_id' => $claim->id,
                'serial_id' => $claim->warranty->serial_id,
                'status' => 'received',
                'technician_id' => $technician?->id,
            ]);
        });
    }

    public function rejectClaim(WarrantyClaim $claim, string $rejectionReason): WarrantyClaim
    {
        $claim->reject();
        $warranty = $claim->warranty;
        $hasOtherActiveClaims = $warranty->claims()
            ->where('id', '!=', $claim->id)
            ->where('status', 'pending')
            ->exists();

        if (!$hasOtherActiveClaims) {
            $warranty->update(['status' => 'active']);
        }

        return $claim;
    }

    public function voidWarranty(Warranty $warranty, string $reason): Warranty
    {
        $warranty->update([
            'status' => 'void',
            'terms' => ($warranty->terms ?? '') . " | Voided: {$reason}",
        ]);

        return $warranty;
    }

    public function getExpiringSoon(int $days = 30)
    {
        $cutoff = now()->addDays($days);

        return Warranty::where('status', 'active')
            ->where('end_date', '<=', $cutoff)
            ->where('end_date', '>=', now())
            ->with(['customer', 'serial.variant.product'])
            ->orderBy('end_date')
            ->get();
    }
}
