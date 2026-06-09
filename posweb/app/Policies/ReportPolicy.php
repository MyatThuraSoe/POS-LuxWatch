<?php

namespace App\Policies;

use App\Models\User;

class ReportPolicy
{
    /**
     * Determine if user can view financial reports
     */
    public function viewFinancial(User $user): bool
    {
        return $user->hasRole(['ADMIN', 'OWNER']);
    }

    /**
     * Determine if user can view inventory reports
     */
    public function viewInventory(User $user): bool
    {
        return $user->hasRole(['ADMIN', 'OWNER']);
    }

    /**
     * Determine if user can export reports
     */
    public function export(User $user): bool
    {
        return $user->hasRole(['ADMIN', 'OWNER']);
    }

    /**
     * Determine if user can view employee performance (all employees)
     */
    public function viewEmployeeAll(User $user): bool
    {
        return $user->hasRole(['ADMIN', 'OWNER']);
    }
}
