<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PermissionMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$permissions): Response
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

        // Check if user has any of the required permissions
        foreach ($permissions as $permission) {
            if ($user->hasPermission($permission)) {
                return $next($request);
            }
        }

        return response()->json([
            'success' => false,
            'data' => null,
            'message' => 'Insufficient permissions',
            'errors' => 'Required permission: ' . implode(' or ', $permissions),
            'meta' => ['timestamp' => now()->utc()->toIso8601String()],
        ], 403);
    }
}
