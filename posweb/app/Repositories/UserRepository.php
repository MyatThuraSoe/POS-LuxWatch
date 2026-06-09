<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;

class UserRepository
{
    public function __construct(protected User $user)
    {
    }

    /**
     * Get paginated users with filters
     */
    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->user->with('roles')->latest();

        if (isset($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['role'])) {
            $query->whereHas('roles', function ($q) use ($filters) {
                $q->where('name', $filters['role']);
            });
        }

        return $query->paginate($perPage);
    }

    /**
     * Find user by ID
     */
    public function find(int $id): ?User
    {
        return $this->user->with('roles')->find($id);
    }

    /**
     * Find user by email
     */
    public function findByEmail(string $email): ?User
    {
        return $this->user->where('email', $email)->first();
    }

    /**
     * Create a new user
     */
    public function create(array $data): User
    {
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $user = $this->user->create($data);

        if (isset($data['role_ids'])) {
            $user->assignRoles($data['role_ids']);
        }

        return $user->fresh(['roles']);
    }

    /**
     * Update an existing user
     */
    public function update(User $user, array $data): User
    {
        // Remove password from data if not provided
        if (isset($data['password']) && empty($data['password'])) {
            unset($data['password']);
        } elseif (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);

        if (isset($data['role_ids'])) {
            $user->assignRoles($data['role_ids']);
        }

        return $user->fresh(['roles']);
    }

    /**
     * Update user status
     */
    public function updateStatus(User $user, string $status): User
    {
        $user->update(['status' => $status]);
        return $user;
    }

    /**
     * Soft delete a user
     */
    public function delete(User $user): bool
    {
        return $user->delete();
    }

    /**
     * Restore a soft-deleted user
     */
    public function restore(int $id): ?User
    {
        $user = $this->user->withTrashed()->find($id);
        if ($user) {
            $user->restore();
            return $user->fresh(['roles']);
        }
        return null;
    }

    /**
     * Get all active users
     */
    public function getActiveUsers(): Collection
    {
        return $this->user->where('status', User::STATUS_ACTIVE)->get();
    }

    /**
     * Check if email exists (including soft deleted)
     */
    public function emailExists(string $email, ?int $excludeId = null): bool
    {
        $query = $this->user->where('email', $email);
        
        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->withTrashed()->exists();
    }

    /**
     * Count users by role
     */
    public function countByRole(string $roleName): int
    {
        return $this->user->whereHas('roles', function ($q) use ($roleName) {
            $q->where('name', $roleName);
        })->count();
    }

    /**
     * Get last active admin/owner count
     */
    public function getLastActiveAdminOrOwnerCount(): int
    {
        return $this->user->where('status', User::STATUS_ACTIVE)
            ->whereHas('roles', function ($q) {
                $q->whereIn('name', ['ADMIN', 'OWNER']);
            })->count();
    }
}
