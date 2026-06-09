<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Queue;

class HealthController extends ApiController
{
    /**
     * Simple ping endpoint.
     */
    public function ping()
    {
        return $this->successResponse(
            data: ['pong' => true],
            message: 'API is responsive'
        );
    }

    /**
     * Comprehensive health check endpoint.
     */
    public function health()
    {
        $healthStatus = [
            'status' => 'healthy',
            'database' => 'unknown',
            'cache' => 'unknown',
            'queue' => 'unknown',
            'version' => config('app.version', '1.0.0'),
        ];

        $overallHealthy = true;

        // Check database connection
        try {
            DB::connection()->getPdo();
            $healthStatus['database'] = 'connected';
        } catch (\Exception $e) {
            $healthStatus['database'] = 'disconnected';
            $overallHealthy = false;
        }

        // Check cache connection
        try {
            Cache::put('health_check', true, 60);
            Cache::forget('health_check');
            $healthStatus['cache'] = 'connected';
        } catch (\Exception $e) {
            $healthStatus['cache'] = 'disconnected';
            $overallHealthy = false;
        }

        // Check queue connection
        try {
            $queueConnection = config('queue.default');
            // For Redis queue, we can check connection
            if ($queueConnection === 'redis') {
                $queue = Queue::connection();
                // Basic check - if we get here without exception, it's connected
                $healthStatus['queue'] = 'connected';
            } else {
                $healthStatus['queue'] = 'configured';
            }
        } catch (\Exception $e) {
            $healthStatus['queue'] = 'disconnected';
            $overallHealthy = false;
        }

        if (!$overallHealthy) {
            $healthStatus['status'] = 'unhealthy';
        }

        $statusCode = $overallHealthy ? 200 : 503;
        $message = $overallHealthy ? 'System operational' : 'Some subsystems are not healthy';

        return $this->successResponse(
            data: $healthStatus,
            message: $message,
            statusCode: $statusCode,
            meta: [
                'timestamp' => now()->utc()->toIso8601String(),
            ]
        );
    }

    /**
     * System information endpoint (Admin/Owner only).
     */
    public function info()
    {
        $info = [
            'app_name' => config('app.name'),
            'app_env' => config('app.env'),
            'app_debug' => config('app.debug'),
            'app_url' => config('app.url'),
            'version' => config('app.version', '1.0.0'),
            'php_version' => PHP_VERSION,
            'laravel_version' => app()->version(),
            'timezone' => config('app.timezone'),
            'locale' => config('app.locale'),
            'database' => [
                'driver' => config('database.default'),
                'host' => config('database.connections.' . config('database.default') . '.host'),
                'database' => config('database.connections.' . config('database.default') . '.database'),
            ],
            'cache' => [
                'driver' => config('cache.default'),
            ],
            'queue' => [
                'driver' => config('queue.default'),
            ],
        ];

        return $this->successResponse(
            data: $info,
            message: 'System information retrieved'
        );
    }
}
