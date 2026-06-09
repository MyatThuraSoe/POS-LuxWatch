<?php

namespace App\Traits;

trait ApiResponseTrait
{
    /**
     * Return a success JSON response.
     */
    protected function successResponse(
        mixed $data = null,
        string $message = 'Operation successful',
        int $statusCode = 200,
        array $meta = []
    ): \Illuminate\Http\JsonResponse {
        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => $message,
            'errors' => null,
            'meta' => array_merge([
                'timestamp' => now()->utc()->toIso8601String(),
            ], $meta),
        ], $statusCode);
    }

    /**
     * Return an error JSON response.
     */
    protected function errorResponse(
        string $message = 'An error occurred',
        mixed $errors = null,
        int $statusCode = 400,
        mixed $data = null
    ): \Illuminate\Http\JsonResponse {
        return response()->json([
            'success' => false,
            'data' => $data,
            'message' => $message,
            'errors' => $errors,
            'meta' => [
                'timestamp' => now()->utc()->toIso8601String(),
            ],
        ], $statusCode);
    }
}
