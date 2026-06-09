<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ReportService;
use App\Http\Requests\ReportFilterRequest;
use App\Http\Requests\ExportRequest;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReportController extends Controller
{
    use ApiResponseTrait;

    protected ReportService $reportService;

    public function __construct(ReportService $reportService)
    {
        $this->reportService = $reportService;
    }

    /**
     * GET /api/v1/reports/dashboard
     */
    public function dashboard(Request $request)
    {
        $startDate = $request->filled('start_date') ? now()->parse($request->start_date) : null;
        $endDate = $request->filled('end_date') ? now()->parse($request->end_date) : null;

        $kpis = $this->reportService->getDashboardKPIs($startDate, $endDate);

        return $this->successResponse($kpis, 'Dashboard KPIs retrieved successfully');
    }

    /**
     * GET /api/v1/reports/sales/daily
     */
    public function daily(ReportFilterRequest $request)
    {
        $report = $this->reportService->getDailySalesReport($request->validated());
        
        return $this->successResponse($report, 'Daily sales report retrieved successfully');
    }

    /**
     * GET /api/v1/reports/sales
     */
    public function sales(ReportFilterRequest $request)
    {
        $report = $this->reportService->getSalesReport($request->validated());
        
        return $this->successResponse($report, 'Sales report retrieved successfully');
    }

    /**
     * GET /api/v1/reports/financial
     */
    public function financial(ReportFilterRequest $request)
    {
        $this->authorize('view_financial', \App\Models\Sale::class);
        
        $report = $this->reportService->getFinancialReport($request->validated());
        
        return $this->successResponse($report, 'Financial report retrieved successfully');
    }

    /**
     * GET /api/v1/reports/inventory
     */
    public function inventory(Request $request)
    {
        $this->authorize('view_inventory', \App\Models\InventoryItem::class);
        
        // Simple inventory report implementation
        $inventory = \App\Models\InventoryItem::with('variant.product.brand')
            ->orderBy('quantity', 'asc')
            ->paginate(20);
            
        return $this->successResponse([
            'data' => $inventory->items(),
            'pagination' => [
                'current_page' => $inventory->currentPage(),
                'last_page' => $inventory->lastPage(),
                'per_page' => $inventory->perPage(),
                'total' => $inventory->total(),
            ]
        ], 'Inventory report retrieved successfully');
    }

    /**
     * GET /api/v1/reports/employees
     */
    public function employees(ReportFilterRequest $request)
    {
        $user = Auth::user();
        $report = $this->reportService->getEmployeePerformance($user, $request->validated());
        
        return $this->successResponse($report, 'Employee performance report retrieved successfully');
    }

    /**
     * POST /api/v1/reports/export
     */
    public function export(ExportRequest $request)
    {
        $user = Auth::user();
        
        $export = $this->reportService->generateExport(
            $request->report,
            $request->filters ?? [],
            $user->id
        );
        
        return $this->successResponse([
            'export_id' => $export->id,
            'status' => $export->status,
            'estimated_time' => '15s',
        ], 'Export job queued successfully', 202);
    }

    /**
     * GET /api/v1/reports/activity
     */
    public function activity(Request $request)
    {
        $logs = \App\Models\AuditLog::with('user')
            ->latest()
            ->limit(20)
            ->get()
            ->map(fn ($log) => [
                'id'          => $log->id,
                'type'        => $log->action,
                'description' => $log->description,
                'user_name'   => $log->user?->name ?? 'System',
                'created_at'  => $log->created_at,
            ]);

        return $this->successResponse($logs, 'Activity feed retrieved successfully');
    }

    /**
     * GET /api/v1/reports/exports/{id}/download
     */
    public function download($id)
    {
        $export = \App\Models\ReportExport::findOrFail($id);
        
        // Check ownership or admin
        if ($export->user_id !== Auth::id() && !Auth::user()->hasRole(['ADMIN', 'OWNER'])) {
            return $this->errorResponse('Unauthorized access to export file', 403);
        }
        
        if ($export->status !== 'completed') {
            return $this->errorResponse('Export not ready yet', 400);
        }
        
        if ($export->isExpired()) {
            return $this->errorResponse('Export link has expired', 410);
        }
        
        $url = $export->download_url;
        
        if (!$url) {
            return $this->errorResponse('File not found', 404);
        }
        
        return $this->successResponse(['download_url' => $url], 'Download URL generated successfully');
    }
}
