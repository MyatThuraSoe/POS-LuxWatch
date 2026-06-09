<?php

namespace App\Http\Controllers;

use App\Http\Requests\Receipt\StorePrintRequest;
use App\Http\Requests\Receipt\UpdateTemplateRequest;
use App\Http\Resources\Receipt\ReceiptResource;
use App\Services\ReceiptService;
use App\Models\Sale;
use App\Models\ReceiptTemplate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReceiptController extends Controller
{
    public function __construct(protected ReceiptService $receiptService)
    {
    }

    public function show(int $saleId): JsonResponse
    {
        $sale = Sale::with(['items.variant.product', 'payments', 'cashier', 'customer'])->findOrFail($saleId);
        
        $receiptData = $this->receiptService->generateReceiptData($sale);
        $receipt = $this->receiptService->getReceiptBySaleId($saleId);

        return response()->json([
            'success' => true,
            'data' => array_merge($receiptData, [
                'receipt' => $receipt ? ReceiptResource::make($receipt) : null,
            ]),
            'message' => 'Receipt data generated successfully',
        ]);
    }

    public function print(StorePrintRequest $request, int $saleId): JsonResponse
    {
        $sale = Sale::findOrFail($saleId);
        $validated = $request->validated();

        $printLog = $this->receiptService->logPrint(
            sale: $sale,
            user: $request->user(),
            terminalId: $validated['terminal_id'],
            action: $validated['action'],
            reason: $validated['reason'] ?? null,
            status: 'success'
        );

        $receiptData = $this->receiptService->generateReceiptData($sale);

        return response()->json([
            'success' => true,
            'data' => array_merge($receiptData, [
                'print_log_id' => $printLog->id,
                'action' => $validated['action'],
            ]),
            'message' => $validated['action'] === 'initial' 
                ? 'Receipt printed successfully' 
                : 'Receipt reprint logged and data returned',
        ], 200);
    }

    public function getTemplates(): JsonResponse
    {
        $templates = ReceiptTemplate::orderByDesc('is_active')
            ->orderByDesc('updated_at')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $templates,
            'message' => 'Receipt templates retrieved',
        ]);
    }

    public function updateTemplate(UpdateTemplateRequest $request, int $templateId): JsonResponse
    {
        $template = $this->receiptService->updateTemplate($request->validated(), $templateId);

        return response()->json([
            'success' => true,
            'data' => $template,
            'message' => 'Receipt template updated successfully',
        ]);
    }

    public function getPrintLogs(Request $request): JsonResponse
    {
        $filters = $request->only(['user_id', 'action', 'status', 'date_from', 'date_to']);
        $perPage = $request->get('per_page', 50);

        $logs = $this->receiptService->getPrintLogs($filters, $perPage);

        return response()->json([
            'success' => true,
            'data' => $logs->items(),
            'meta' => [
                'current_page' => $logs->currentPage(),
                'last_page' => $logs->lastPage(),
                'per_page' => $logs->perPage(),
                'total' => $logs->total(),
            ],
            'message' => 'Print logs retrieved successfully',
        ]);
    }
}
