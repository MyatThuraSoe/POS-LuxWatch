<?php

namespace App\Services;

use App\Models\ReportExport;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\InventoryItem;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class ReportService
{
    /**
     * Get Dashboard KPIs
     */
    public function getDashboardKPIs(?Carbon $startDate = null, ?Carbon $endDate = null): array
    {
        $startDate = $startDate ?? now()->startOfMonth();
        $endDate = $endDate ?? now()->endOfDay();

        return Cache::remember(
            "dashboard_kpis_{$startDate->toDateString()}_{$endDate->toDateString()}",
            300, // 5 minutes
            function () use ($startDate, $endDate) {
                $salesQuery = Sale::whereBetween('created_at', [$startDate, $endDate])
                    ->whereIn('status', ['completed', 'refunded', 'partially_refunded']);

                $totalRevenue = $salesQuery->sum('total_amount');
                $transactionCount = $salesQuery->count();
                
                // Calculate COGS for sold items
                $cogs = DB::table('sale_items')
                    ->join('sales', 'sale_items.sale_id', '=', 'sales.id')
                    ->join('product_variants', 'sale_items.variant_id', '=', 'product_variants.id')
                    ->join('inventory_items', 'product_variants.id', '=', 'inventory_items.variant_id')
                    ->whereBetween('sales.created_at', [$startDate, $endDate])
                    ->whereIn('sales.status', ['completed', 'refunded', 'partially_refunded'])
                    ->sum(DB::raw('sale_items.quantity * product_variants.cost_price'));

                $grossProfit = $totalRevenue - $cogs;
                $avgOrderValue = $transactionCount > 0 ? $totalRevenue / $transactionCount : 0;

                // Low stock count
                $lowStockCount = InventoryItem::whereColumn('quantity', '<=', 'low_stock_threshold')->count();

                return [
                    'total_revenue' => round($totalRevenue, 2),
                    'gross_profit' => round($grossProfit, 2),
                    'profit_margin' => $totalRevenue > 0 ? round(($grossProfit / $totalRevenue) * 100, 2) : 0,
                    'transaction_count' => $transactionCount,
                    'avg_order_value' => round($avgOrderValue, 2),
                    'low_stock_count' => $lowStockCount,
                    'period' => [
                        'start' => $startDate->toDateString(),
                        'end' => $endDate->toDateString(),
                    ]
                ];
            }
        );
    }

    /**
     * Get Sales Report with filters
     */
    public function getSalesReport(array $filters): array
    {
        $query = Sale::with(['cashier', 'customer', 'items.variant.product.brand'])
            ->whereIn('status', ['completed', 'refunded', 'partially_refunded']);

        if (!empty($filters['start_date'])) {
            $query->whereDate('created_at', '>=', $filters['start_date']);
        }
        if (!empty($filters['end_date'])) {
            $query->whereDate('created_at', '<=', $filters['end_date']);
        }
        if (!empty($filters['cashier_id'])) {
            $query->where('cashier_id', $filters['cashier_id']);
        }
        if (!empty($filters['category_id'])) {
            $query->whereHas('items.variant.product', function ($q) use ($filters) {
                $q->where('category_id', $filters['category_id']);
            });
        }

        $sales = $query->orderBy('created_at', 'desc')
            ->paginate($filters['per_page'] ?? 20);

        return [
            'data' => $sales->items(),
            'pagination' => [
                'current_page' => $sales->currentPage(),
                'last_page' => $sales->lastPage(),
                'per_page' => $sales->perPage(),
                'total' => $sales->total(),
            ]
        ];
    }

    /**
     * Get Financial Report (P&L Summary)
     */
    public function getFinancialReport(array $filters): array
    {
        $startDate = !empty($filters['start_date']) ? Carbon::parse($filters['start_date']) : now()->startOfMonth();
        $endDate = !empty($filters['end_date']) ? Carbon::parse($filters['end_date']) : now()->endOfDay();

        $salesQuery = Sale::whereBetween('created_at', [$startDate, $endDate])
            ->whereIn('status', ['completed', 'refunded', 'partially_refunded']);

        $totalRevenue = $salesQuery->sum('total_amount');
        $totalTax = $salesQuery->sum('tax_amount');
        $totalDiscount = $salesQuery->sum('discount_amount');
        
        // COGS Calculation
        $cogs = DB::table('sale_items')
            ->join('sales', 'sale_items.sale_id', '=', 'sales.id')
            ->join('product_variants', 'sale_items.variant_id', '=', 'product_variants.id')
            ->whereBetween('sales.created_at', [$startDate, $endDate])
            ->whereIn('sales.status', ['completed', 'refunded', 'partially_refunded'])
            ->sum(DB::raw('sale_items.quantity * product_variants.cost_price'));

        $grossProfit = $totalRevenue - $cogs;

        // Payment method breakdown
        $paymentBreakdown = DB::table('payments')
            ->join('sales', 'payments.sale_id', '=', 'sales.id')
            ->whereBetween('sales.created_at', [$startDate, $endDate])
            ->whereIn('sales.status', ['completed', 'refunded', 'partially_refunded'])
            ->select('method', DB::raw('SUM(amount) as total'))
            ->groupBy('method')
            ->get();

        return [
            'period' => [
                'start' => $startDate->toDateString(),
                'end' => $endDate->toDateString(),
            ],
            'revenue' => round($totalRevenue, 2),
            'cogs' => round($cogs, 2),
            'gross_profit' => round($grossProfit, 2),
            'profit_margin_percent' => $totalRevenue > 0 ? round(($grossProfit / $totalRevenue) * 100, 2) : 0,
            'tax_collected' => round($totalTax, 2),
            'discounts_given' => round($totalDiscount, 2),
            'payment_methods' => $paymentBreakdown->pluck('total', 'method')->toArray(),
        ];
    }

    /**
     * Get Employee Performance Report
     */
    public function getEmployeePerformance(User $authenticatedUser, array $filters): array
    {
        $query = Sale::whereIn('status', ['completed', 'refunded', 'partially_refunded']);

        // Scope to current user if not Admin/Owner
        if (!$authenticatedUser->hasRole(['ADMIN', 'OWNER'])) {
            $query->where('cashier_id', $authenticatedUser->id);
        } elseif (!empty($filters['employee_id'])) {
            $query->where('cashier_id', $filters['employee_id']);
        }

        if (!empty($filters['start_date'])) {
            $query->whereDate('created_at', '>=', $filters['start_date']);
        }
        if (!empty($filters['end_date'])) {
            $query->whereDate('created_at', '<=', $filters['end_date']);
        }

        $performance = $query->select('cashier_id', 
                DB::raw('COUNT(*) as transaction_count'),
                DB::raw('SUM(total_amount) as total_revenue'),
                DB::raw('SUM(discount_amount) as total_discounts'),
                DB::raw('AVG(total_amount) as avg_order_value')
            )
            ->groupBy('cashier_id')
            ->with('cashier:id,name,email')
            ->get();

        return [
            'data' => $performance->map(function ($item) {
                return [
                    'employee' => $item->cashier,
                    'transaction_count' => $item->transaction_count,
                    'total_revenue' => round($item->total_revenue, 2),
                    'total_discounts' => round($item->total_discounts, 2),
                    'avg_order_value' => round($item->avg_order_value, 2),
                ];
            }),
        ];
    }

    /**
     * Generate Export File (CSV)
     */
    public function generateExport(string $reportType, array $filters, int $userId): ReportExport
    {
        $export = ReportExport::create([
            'user_id' => $userId,
            'type' => 'csv',
            'report_type' => $reportType,
            'filters' => $filters,
            'status' => 'processing',
            'expires_at' => now()->addDays(30),
        ]);

        // Process synchronously for now (could be queued)
        try {
            $data = [];
            $filename = "export_{$reportType}_" . now()->format('Y-m-d_His') . '.csv';
            $path = "exports/{$filename}";

            switch ($reportType) {
                case 'sales':
                    $reportData = $this->getSalesReport($filters);
                    $data = $reportData['data'];
                    break;
                case 'financial':
                    $data = [$this->getFinancialReport($filters)];
                    break;
                case 'employees':
                    $user = User::find($userId);
                    $data = $this->getEmployeePerformance($user, $filters)['data'];
                    break;
            }

            // Generate CSV
            $csvContent = $this->generateCSV($data, $reportType);
            Storage::put($path, $csvContent);

            $export->update([
                'status' => 'completed',
                'file_path' => $path,
            ]);
        } catch (\Exception $e) {
            $export->update([
                'status' => 'failed',
            ]);
            throw $e;
        }

        return $export;
    }

    private function generateCSV(array $data, string $type): string
    {
        if (empty($data)) {
            return '';
        }

        $handle = fopen('php://temp', 'r+');
        
        // Headers based on type
        $headers = array_keys(is_array($data[0]) ? $data[0] : (array)$data[0]);
        fputcsv($handle, $headers);

        foreach ($data as $row) {
            fputcsv($handle, (array)$row);
        }

        rewind($handle);
        $csv = stream_get_contents($handle);
        fclose($handle);

        return $csv;
    }
}
