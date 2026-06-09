<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Requests\User\UpdateProfileRequest;
use App\Http\Requests\User\ChangePasswordRequest;
use App\Http\Resources\User\UserResource;
use App\Http\Resources\User\UserCollection;
use App\Models\User;
use App\Services\UserService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    use ApiResponseTrait;

    public function __construct(protected UserService $userService)
    {
    }

    /**
     * Display a listing of users.
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', User::class);

        $filters = $request->only(['search', 'status', 'role']);
        $perPage = $request->get('per_page', 15);

        $users = $this->userService->getPaginatedUsers($filters, $perPage);

        return $this->success(
            new UserCollection($users),
            'Users retrieved successfully'
        );
    }

    /**
     * Store a newly created user.
     */
    public function store(StoreUserRequest $request): JsonResponse
    {
        $user = $this->userService->createUser($request->validated());

        return $this->success(
            new UserResource($user),
            'User created successfully',
            [],
            201
        );
    }

    /**
     * Display the specified user.
     */
    public function show(int $id): JsonResponse
    {
        $user = $this->userService->getUserById($id);

        if (!$user) {
            return $this->error('User not found', 404);
        }

        $this->authorize('view', $user);

        return $this->success(
            new UserResource($user->load('roles')),
            'User retrieved successfully'
        );
    }

    /**
     * Update the specified user.
     */
    public function update(UpdateUserRequest $request, int $id): JsonResponse
    {
        $user = $this->userService->getUserById($id);

        if (!$user) {
            return $this->error('User not found', 404);
        }

        $this->authorize('update', $user);

        $updatedUser = $this->userService->updateUser($user, $request->validated());

        return $this->success(
            new UserResource($updatedUser->load('roles')),
            'User updated successfully'
        );
    }

    /**
     * Update user status.
     */
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'status' => ['required', 'in:' . implode(',', User::getAvailableStatuses())],
        ]);

        $user = $this->userService->getUserById($id);

        if (!$user) {
            return $this->error('User not found', 404);
        }

        $this->authorize('suspend', $user);

        $updatedUser = $this->userService->updateUserStatus($user, $request->input('status'));

        return $this->success(
            new UserResource($updatedUser->load('roles')),
            'User status updated successfully'
        );
    }

    /**
     * Remove the specified user (soft delete).
     */
    public function destroy(int $id): JsonResponse
    {
        $user = $this->userService->getUserById($id);

        if (!$user) {
            return $this->error('User not found', 404);
        }

        $this->authorize('delete', $user);

        $this->userService->deleteUser($user);

        return $this->success(
            null,
            'User deleted successfully'
        );
    }

    /**
     * Get current authenticated user's profile.
     */
    public function profile(): JsonResponse
    {
        $user = Auth::user();

        return $this->success(
            new UserResource($user->load('roles')),
            'Profile retrieved successfully'
        );
    }

    /**
     * Update current user's profile.
     */
    public function updateProfile(UpdateProfileRequest $request): JsonResponse
    {
        $user = Auth::user();
        $updatedUser = $this->userService->updateProfile($user, $request->validated());

        return $this->success(
            new UserResource($updatedUser->load('roles')),
            'Profile updated successfully'
        );
    }

    /**
     * Change current user's password.
     */
    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        $user = Auth::user();

        try {
            $this->userService->changePassword(
                $user,
                $request->input('current_password'),
                $request->input('new_password')
            );

            return $this->success(
                null,
                'Password changed successfully'
            );
        } catch (\InvalidArgumentException $e) {
            return $this->error($e->getMessage(), 422);
        }
    }
}
