<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\User;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => 'Unauthenticated',
                'errors' => null,
                'meta' => ['timestamp' => now()->utc()->toIso8601String()],
            ], 401);
        }

        // Check if user has any of the required roles
        foreach ($roles as $role) {
            if ($user->hasRole($role)) {
                return $next($request);
            }
        }

        return response()->json([
            'success' => false,
            'data' => null,
            'message' => 'Insufficient permissions',
            'errors' => 'Required role: ' . implode(' or ', $roles),
            'meta' => ['timestamp' => now()->utc()->toIso8601String()],
        ], 403);
    }
}
