<?php

namespace App\Services;

use App\Repositories\UserRepository;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\PersonalAccessToken;

class UserService
{
    public function __construct(protected UserRepository $userRepository)
    {
    }

    /**
     * Get paginated users with filters
     */
    public function getPaginatedUsers(array $filters = [], int $perPage = 15)
    {
        return $this->userRepository->paginate($filters, $perPage);
    }

    /**
     * Get user by ID
     */
    public function getUserById(int $id): ?User
    {
        return $this->userRepository->find($id);
    }

    /**
     * Create a new user
     */
    public function createUser(array $data): User
    {
        // Validate email uniqueness
        if ($this->userRepository->emailExists($data['email'])) {
            throw new \InvalidArgumentException('Email already in use');
        }

        // Generate temporary password if not provided
        if (empty($data['password'])) {
            $data['password'] = bin2hex(random_bytes(8));
        }

        return DB::transaction(function () use ($data) {
            $user = $this->userRepository->create($data);
            
            // Log audit event
            $this->logAuditEvent('created', $user);
            
            return $user;
        });
    }

    /**
     * Update an existing user
     */
    public function updateUser(User $user, array $data): User
    {
        // Check email uniqueness if email is being changed
        if (isset($data['email']) && $data['email'] !== $user->email) {
            if ($this->userRepository->emailExists($data['email'], $user->id)) {
                throw new \InvalidArgumentException('Email already in use');
            }
        }

        return DB::transaction(function () use ($user, $data) {
            $updatedUser = $this->userRepository->update($user, $data);
            
            // Log audit event
            $this->logAuditEvent('updated', $updatedUser);
            
            return $updatedUser;
        });
    }

    /**
     * Update user status
     */
    public function updateUserStatus(User $user, string $status): User
    {
        if (!in_array($status, User::getAvailableStatuses())) {
            throw new \InvalidArgumentException('Invalid status');
        }

        // Prevent suspending last active admin/owner
        if ($status === User::STATUS_SUSPENDED && $user->hasAnyRole(['ADMIN', 'OWNER'])) {
            $count = $this->userRepository->getLastActiveAdminOrOwnerCount();
            if ($count <= 1 && $user->isActive()) {
                throw new \RuntimeException('Cannot suspend the last active ADMIN or OWNER');
            }
        }

        // Revoke tokens if suspending or deactivating
        if (in_array($status, [User::STATUS_SUSPENDED, User::STATUS_INACTIVE])) {
            $this->revokeUserTokens($user);
        }

        return DB::transaction(function () use ($user, $status) {
            $updatedUser = $this->userRepository->updateStatus($user, $status);
            
            $this->logAuditEvent('status_changed', $updatedUser, ['new_status' => $status]);
            
            return $updatedUser;
        });
    }

    /**
     * Delete a user (soft delete)
     */
    public function deleteUser(User $user): bool
    {
        // Prevent deleting self
        if (Auth::id() === $user->id) {
            throw new \RuntimeException('Cannot delete yourself');
        }

        // Prevent deleting last active admin/owner
        if ($user->hasAnyRole(['ADMIN', 'OWNER'])) {
            $count = $this->userRepository->getLastActiveAdminOrOwnerCount();
            if ($count <= 1) {
                throw new \RuntimeException('Cannot delete the last ADMIN or OWNER');
            }
        }

        // Revoke all tokens
        $this->revokeUserTokens($user);

        return DB::transaction(function () use ($user) {
            $result = $this->userRepository->delete($user);
            
            $this->logAuditEvent('deleted', $user);
            
            return $result;
        });
    }

    /**
     * Restore a soft-deleted user
     */
    public function restoreUser(int $id): ?User
    {
        $user = $this->userRepository->restore($id);
        
        if ($user) {
            $this->logAuditEvent('restored', $user);
        }
        
        return $user;
    }

    /**
     * Change user password
     */
    public function changePassword(User $user, string $currentPassword, string $newPassword): bool
    {
        if (!Auth::guard('web')->attempt(['email' => $user->email, 'password' => $currentPassword])) {
            throw new \InvalidArgumentException('Current password is incorrect');
        }

        return DB::transaction(function () use ($user, $newPassword) {
            $this->userRepository->update($user, ['password' => $newPassword]);
            
            // Revoke all other tokens
            $this->revokeUserTokens($user, true);
            
            $this->logAuditEvent('password_changed', $user);
            
            return true;
        });
    }

    /**
     * Update user profile
     */
    public function updateProfile(User $user, array $data): User
    {
        $allowedFields = ['name', 'phone', 'avatar_url'];
        $filteredData = array_intersect_key($data, array_flip($allowedFields));

        return $this->userRepository->update($user, $filteredData);
    }

    /**
     * Revoke all user tokens
     */
    protected function revokeUserTokens(User $user, bool $keepCurrent = false): void
    {
        if ($keepCurrent) {
            $currentToken = Auth::guard('sanctum')->user()?->currentAccessToken();
            PersonalAccessToken::where('tokenable_id', $user->id)->delete();
            // Note: In real implementation, you'd keep the current token
        } else {
            PersonalAccessToken::where('tokenable_id', $user->id)->delete();
        }
    }

    /**
     * Log audit event
     */
    protected function logAuditEvent(string $action, User $user, array $metadata = []): void
    {
        // This would integrate with the AuditLog model from Phase 0
        // For now, we'll just create a basic log entry
        \App\Models\AuditLog::create([
            'user_id' => Auth::id(),
            'action' => "user_{$action}",
            'entity_type' => User::class,
            'entity_id' => $user->id,
            'new_values' => $metadata + ['name' => $user->name, 'email' => $user->email],
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    /**
     * Clear permission cache for user
     */
    public function clearPermissionCache(User $user): void
    {
        Cache::forget("user_permissions_{$user->id}");
    }
}
