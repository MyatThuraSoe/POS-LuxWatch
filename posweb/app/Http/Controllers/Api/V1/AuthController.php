<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends ApiController
{
    /**
     * Authenticate a user and issue a Sanctum token.
     */
    public function login(Request $request): JsonResponse
    {
        
        
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
            'remember' => ['sometimes', 'boolean'],
        ]);

        $user = User::with('roles.permissions')
            ->where('email', $credentials['email'])
            ->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if (!$user->isActive()) {
            return $this->errorResponse('This account is not active.', null, 403);
        }

        $user->updateLastLogin();

        $tokenName = $credentials['remember'] ?? false ? 'luxwatch-remembered-session' : 'luxwatch-session';
        $token = $user->createToken($tokenName, $user->getAllPermissions())->plainTextToken;

        return $this->successResponse([
            'user' => UserResource::make($user->fresh('roles.permissions')),
            'token' => $token,
            'token_type' => 'Bearer',
        ], 'Login successful');
    }

    /**
     * Return the authenticated user.
     */
    public function me(Request $request): JsonResponse
    {
        return $this->successResponse(
            UserResource::make($request->user()->load('roles.permissions')),
            'Authenticated user retrieved successfully'
        );
    }

    /**
     * Revoke the current access token.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()?->currentAccessToken()?->delete();

        return $this->successResponse(null, 'Logout successful');
    }

    /**
     * Replace the current access token with a fresh one.
     */
    public function refresh(Request $request): JsonResponse
    {
        $user = $request->user()->load('roles.permissions');
        $request->user()?->currentAccessToken()?->delete();

        $token = $user->createToken('luxwatch-session', $user->getAllPermissions())->plainTextToken;

        return $this->successResponse([
            'user' => UserResource::make($user),
            'token' => $token,
            'token_type' => 'Bearer',
        ], 'Token refreshed successfully');
    }
}

