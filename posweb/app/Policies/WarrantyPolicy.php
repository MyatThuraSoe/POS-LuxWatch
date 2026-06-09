<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Warranty;
use App\Models\RepairJob;
use App\Models\ReceiptTemplate;

class WarrantyPolicy
{
    public function view(User $user): bool
    {
        return $user->hasPermission('warranties.view');
    }

    public function claim(User $user): bool
    {
        return $user->hasPermission('warranties.claim');
    }

    public function void(User $user): bool
    {
        return $user->role === 'ADMIN' || $user->role === 'OWNER';
    }
}

class RepairJobPolicy
{
    public function view(User $user): bool
    {
        return $user->hasPermission('repairs.view') || $user->hasPermission('repairs.manage');
    }

    public function manage(User $user): bool
    {
        return $user->hasPermission('repairs.manage');
    }

    public function updateStatus(User $user, RepairJob $job): bool
    {
        return $user->hasPermission('repairs.manage');
    }
}

class ReceiptTemplatePolicy
{
    public function view(User $user): bool
    {
        return $user->hasPermission('receipts.view');
    }

    public function manageTemplates(User $user): bool
    {
        return $user->hasPermission('templates.manage');
    }
}

class PrintLogPolicy
{
    public function view(User $user): bool
    {
        return $user->hasPermission('print_logs.view');
    }
}
