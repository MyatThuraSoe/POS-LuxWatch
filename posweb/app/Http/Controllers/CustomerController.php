<?php

namespace App\Http\Controllers;

use App\Http\Requests\Customer\StoreCustomerRequest;
use App\Http\Requests\Customer\UpdateCustomerRequest;
use App\Http\Requests\Customer\SubmitClaimRequest;
use App\Http\Requests\Customer\UpdateRepairStatusRequest;
use App\Http\Resources\Customer\CustomerResource;
use App\Http\Resources\Customer\WarrantyResource;
use App\Http\Resources\Customer\RepairJobResource;
use App\Services\CustomerService;
use App\Services\WarrantyService;
use App\Services\RepairService;
use App\Models\Customer;
use App\Models\Warranty;
use App\Models\RepairJob;
use App\Models\SerialNumber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function __construct(
        protected CustomerService $customerService,
        protected WarrantyService $warrantyService,
        protected RepairService $repairService
    ) {
    }

    // Customer CRUD
    public function index(Request $request): JsonResponse
    {
        $query = $request->get('search');
        
        if ($query) {
            $customers = $this->customerService->search($query);
        } else {
            $customers = Customer::orderBy('name')->paginate(20);
        }

        return response()->json([
            'success' => true,
            'data' => CustomerResource::collection($customers),
            'meta' => [
                'current_page' => $customers->currentPage(),
                'last_page' => $customers->lastPage(),
                'per_page' => $customers->perPage(),
                'total' => $customers->total(),
            ],
            'message' => 'Customers retrieved successfully',
        ]);
    }

    public function store(StoreCustomerRequest $request): JsonResponse
    {
        $customer = $this->customerService->create($request->validated());

        return response()->json([
            'success' => true,
            'data' => CustomerResource::make($customer),
            'message' => 'Customer created successfully',
        ], 201);
    }

    public function show(Customer $customer): JsonResponse
    {
        $customer = $this->customerService->getWithHistory($customer->id);

        return response()->json([
            'success' => true,
            'data' => CustomerResource::make($customer),
            'message' => 'Customer details retrieved',
        ]);
    }

    public function update(UpdateCustomerRequest $request, Customer $customer): JsonResponse
    {
        $customer = $this->customerService->update($customer, $request->validated());

        return response()->json([
            'success' => true,
            'data' => CustomerResource::make($customer),
            'message' => 'Customer updated successfully',
        ]);
    }

    public function destroy(Customer $customer): JsonResponse
    {
        $customer->delete();

        return response()->json([
            'success' => true,
            'message' => 'Customer deleted successfully',
        ]);
    }

    public function history(Customer $customer): JsonResponse
    {
        $customer = $this->customerService->getWithHistory($customer->id);

        return response()->json([
            'success' => true,
            'data' => [
                'customer' => CustomerResource::make($customer),
                'purchase_history' => $customer->purchase_history,
            ],
            'message' => 'Customer purchase history retrieved',
        ]);
    }

    // Warranty methods
    public function warrantyBySerial(string $serialCode): JsonResponse
    {
        $warranty = $this->warrantyService->getBySerial($serialCode);

        if (!$warranty) {
            return response()->json([
                'success' => false,
                'message' => 'No warranty found for this serial number',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => WarrantyResource::make($warranty),
            'message' => 'Warranty details retrieved',
        ]);
    }

    public function submitClaim(SubmitClaimRequest $request, Warranty $warranty): JsonResponse
    {
        try {
            $claim = $this->warrantyService->submitClaim(
                $warranty,
                $request->user(),
                $request->reason,
                $request->customer_description
            );

            return response()->json([
                'success' => true,
                'data' => [
                    'claim_id' => $claim->id,
                    'claim_number' => $claim->claim_number,
                    'status' => $claim->status,
                    'warranty_valid' => true,
                ],
                'message' => 'Warranty claim submitted successfully',
            ], 201);
        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    public function voidWarranty(Request $request, Warranty $warranty): JsonResponse
    {
        $request->validate(['reason' => 'required|string|max:255']);

        $warranty = $this->warrantyService->voidWarranty($warranty, $request->reason);

        return response()->json([
            'success' => true,
            'data' => WarrantyResource::make($warranty),
            'message' => 'Warranty voided successfully',
        ]);
    }

    // Repair methods
    public function getRepairs(Request $request): JsonResponse
    {
        $status = $request->get('status');
        $repairs = RepairJob::with(['claim.warranty.serial.variant.product', 'technician'])
            ->when($status, fn($q) => $q->where('status', $status))
            ->orderByDesc('updated_at')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => RepairJobResource::collection($repairs),
            'meta' => [
                'current_page' => $repairs->currentPage(),
                'last_page' => $repairs->lastPage(),
                'per_page' => $repairs->perPage(),
                'total' => $repairs->total(),
            ],
            'message' => 'Repair jobs retrieved',
        ]);
    }

    public function repairStats(): JsonResponse
    {
        $stats = $this->repairService->getStats();

        return response()->json([
            'success' => true,
            'data' => $stats,
            'message' => 'Repair statistics retrieved',
        ]);
    }

    public function overdueRepairs(): JsonResponse
    {
        $overdue = $this->repairService->getOverdueJobs();

        return response()->json([
            'success' => true,
            'data' => RepairJobResource::collection($overdue),
            'message' => 'Overdue repair jobs retrieved',
        ]);
    }

    public function updateRepairStatus(UpdateRepairStatusRequest $request, RepairJob $repairJob): JsonResponse
    {
        $repairJob = $this->repairService->updateStatus(
            $repairJob,
            $request->status,
            $request->diagnosis,
            $request->repair_cost
        );

        return response()->json([
            'success' => true,
            'data' => RepairJobResource::make($repairJob),
            'message' => 'Repair status updated successfully',
        ]);
    }

    public function repairsByTechnician(int $technicianId, Request $request): JsonResponse
    {
        $status = $request->get('status');
        $repairs = $this->repairService->getByTechnician($technicianId, $status);

        return response()->json([
            'success' => true,
            'data' => RepairJobResource::collection($repairs),
            'meta' => [
                'current_page' => $repairs->currentPage(),
                'last_page' => $repairs->lastPage(),
                'per_page' => $repairs->perPage(),
                'total' => $repairs->total(),
            ],
            'message' => 'Technician repairs retrieved',
        ]);
    }

    public function expiringWarranties(Request $request): JsonResponse
    {
        $days = $request->get('days', 30);
        $warranties = $this->warrantyService->getExpiringSoon($days);

        return response()->json([
            'success' => true,
            'data' => WarrantyResource::collection($warranties),
            'message' => "Warranties expiring within {$days} days",
        ]);
    }
}
