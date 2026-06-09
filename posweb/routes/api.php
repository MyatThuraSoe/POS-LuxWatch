<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\HealthController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\BrandController;
use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Controllers\Api\V1\InventoryController;
use App\Http\Controllers\Api\V1\SupplierController;
use App\Http\Controllers\Api\V1\PurchaseOrderController;
use App\Http\Controllers\Api\V1\PosController;
use App\Http\Controllers\ReceiptController;
use App\Http\Controllers\CustomerController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// API Version 1 Routes
Route::prefix('v1')->group(function () {
    // Public endpoints
    Route::get('/ping', [HealthController::class, 'ping']);
    Route::get('/health', [HealthController::class, 'health']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    

    // Protected endpoints
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::post('/auth/refresh', [AuthController::class, 'refresh']);

        // System info
        Route::get('/system/info', [HealthController::class, 'info'])
            ->middleware(['role:admin,owner']);

        // User management
        Route::prefix('users')->group(function () {
            Route::get('/', [UserController::class, 'index'])->middleware(['permission:users.view,users.manage']);
            Route::post('/', [UserController::class, 'store'])->middleware(['permission:users.create,users.manage']);
            Route::get('/{id}', [UserController::class, 'show'])->middleware(['permission:users.view,users.manage']);
            Route::put('/{id}', [UserController::class, 'update'])->middleware(['permission:users.update,users.manage']);
            Route::patch('/{id}/status', [UserController::class, 'updateStatus'])->middleware(['permission:users.suspend,users.manage']);
            Route::delete('/{id}', [UserController::class, 'destroy'])->middleware(['permission:users.delete,users.manage']);
        });

        // Profile
        Route::prefix('profile')->group(function () {
            Route::get('/', [UserController::class, 'profile']);
            Route::put('/', [UserController::class, 'updateProfile']);
            Route::post('/password', [UserController::class, 'changePassword']);
        });

        // Categories (Phase 3)
        Route::prefix('categories')->group(function () {
            Route::get('/', [CategoryController::class, 'index'])->middleware(['permission:catalog.view,catalog.manage']);
            Route::get('/tree', [CategoryController::class, 'tree'])->middleware(['permission:catalog.view,catalog.manage']);
            Route::post('/', [CategoryController::class, 'store'])->middleware(['permission:catalog.create,catalog.manage']);
            Route::get('/{id}', [CategoryController::class, 'show'])->middleware(['permission:catalog.view,catalog.manage']);
            Route::put('/{id}', [CategoryController::class, 'update'])->middleware(['permission:catalog.update,catalog.manage']);
            Route::delete('/{id}', [CategoryController::class, 'destroy'])->middleware(['permission:catalog.delete,catalog.manage']);
        });

        // Brands (Phase 3)
        Route::prefix('brands')->group(function () {
            Route::get('/', [BrandController::class, 'index'])->middleware(['permission:catalog.view,catalog.manage']);
            Route::post('/', [BrandController::class, 'store'])->middleware(['permission:catalog.create,catalog.manage']);
            Route::get('/{id}', [BrandController::class, 'show'])->middleware(['permission:catalog.view,catalog.manage']);
            Route::put('/{id}', [BrandController::class, 'update'])->middleware(['permission:catalog.update,catalog.manage']);
            Route::delete('/{id}', [BrandController::class, 'destroy'])->middleware(['permission:catalog.delete,catalog.manage']);
        });

        // Products (Phase 3)
        Route::prefix('products')->group(function () {
            Route::get('/', [ProductController::class, 'index'])->middleware(['permission:catalog.view,catalog.manage']);
            Route::post('/', [ProductController::class, 'store'])->middleware(['permission:catalog.create,catalog.manage']);
            Route::get('/{id}', [ProductController::class, 'show'])->middleware(['permission:catalog.view,catalog.manage']);
            Route::put('/{id}', [ProductController::class, 'update'])->middleware(['permission:catalog.update,catalog.manage']);
            Route::delete('/{id}', [ProductController::class, 'destroy'])->middleware(['permission:catalog.delete,catalog.manage']);
            Route::post('/{id}/variants', [ProductController::class, 'addVariant'])->middleware(['permission:catalog.update,catalog.manage']);
            Route::post('/{id}/images', [ProductController::class, 'uploadImages'])->middleware(['permission:catalog.update,catalog.manage']);
        });

        // Inventory (Phase 4)
        Route::prefix('inventory')->group(function () {
            Route::get('/', [InventoryController::class, 'index'])->middleware(['permission:inventory.view,inventory.manage']);
            Route::post('/adjust', [InventoryController::class, 'adjust'])->middleware(['permission:inventory.adjust,inventory.manage']);
            Route::get('/movements', [InventoryController::class, 'movements'])->middleware(['permission:inventory.view,inventory.manage']);
            Route::get('/alerts', [InventoryController::class, 'alerts'])->middleware(['permission:inventory.view,inventory.manage']);
            Route::get('/low-stock', [InventoryController::class, 'lowStock'])->middleware(['permission:inventory.view,inventory.manage']);
            Route::get('/{variant_id}', [InventoryController::class, 'show'])->middleware(['permission:inventory.view,inventory.manage']);
        });

        // Serial Numbers (Phase 4)
        Route::prefix('serials')->group(function () {
            Route::post('/register', [InventoryController::class, 'registerSerial'])->middleware(['permission:serials.manage,inventory.manage']);
            Route::get('/{code}', [InventoryController::class, 'getSerial'])->middleware(['permission:inventory.view,inventory.manage']);
        });

        // Suppliers (Phase 5)
        Route::prefix('suppliers')->group(function () {
            Route::get('/', [SupplierController::class, 'index'])->middleware(['permission:suppliers.view,suppliers.manage']);
            Route::post('/', [SupplierController::class, 'store'])->middleware(['permission:suppliers.create,suppliers.manage']);
            Route::get('/{id}', [SupplierController::class, 'show'])->middleware(['permission:suppliers.view,suppliers.manage']);
            Route::put('/{id}', [SupplierController::class, 'update'])->middleware(['permission:suppliers.update,suppliers.manage']);
            Route::delete('/{id}', [SupplierController::class, 'destroy'])->middleware(['permission:suppliers.delete,suppliers.manage']);
            Route::post('/{id}/contacts', [SupplierController::class, 'addContact'])->middleware(['permission:suppliers.update,suppliers.manage']);
            Route::get('/{id}/purchase-history', [SupplierController::class, 'purchaseHistory'])->middleware(['permission:suppliers.view,suppliers.manage']);
        });

        // Purchase Orders (Phase 6)
        Route::prefix('purchases')->group(function () {
            Route::get('/', [PurchaseOrderController::class, 'index'])->middleware(['permission:purchases.view,purchases.manage']);
            Route::post('/', [PurchaseOrderController::class, 'store'])->middleware(['permission:purchases.create,purchases.manage']);
            Route::get('/{id}', [PurchaseOrderController::class, 'show'])->middleware(['permission:purchases.view,purchases.manage']);
            Route::put('/{id}', [PurchaseOrderController::class, 'update'])->middleware(['permission:purchases.update,purchases.manage']);
            Route::post('/{id}/approve', [PurchaseOrderController::class, 'approve'])->middleware(['permission:purchases.approve,purchases.manage']);
            Route::post('/{id}/receive', [PurchaseOrderController::class, 'receive'])->middleware(['permission:purchases.receive,purchases.manage']);
            Route::post('/{id}/cancel', [PurchaseOrderController::class, 'cancel'])->middleware(['permission:purchases.cancel,purchases.manage']);
            Route::get('/{id}/pdf', [PurchaseOrderController::class, 'generatePdf'])->middleware(['permission:purchases.view,purchases.manage']);
        });

        // POS Sales (Phase 7)
        Route::prefix('pos')->group(function () {
            Route::get('/cart', [PosController::class, 'getCart'])->middleware(['permission:pos.cart.manage,pos.checkout']);
            Route::post('/cart', [PosController::class, 'addToCart'])->middleware(['permission:pos.cart.manage,pos.checkout']);
            Route::put('/cart', [PosController::class, 'updateCart'])->middleware(['permission:pos.cart.manage,pos.checkout']);
            Route::delete('/cart', [PosController::class, 'clearCart'])->middleware(['permission:pos.cart.manage,pos.checkout']);
            Route::post('/checkout', [PosController::class, 'checkout'])->middleware(['permission:pos.checkout']);
            Route::get('/sales/today', [PosController::class, 'salesToday'])->middleware(['permission:pos.sales.view']);
            Route::get('/sales', [PosController::class, 'salesHistory'])->middleware(['permission:pos.view_history']);
            Route::get('/sales/{id}', [PosController::class, 'saleDetails'])->middleware(['permission:pos.view_history']);
            Route::post('/sales/{id}/refund', [PosController::class, 'refund'])->middleware(['permission:pos.refund.process']);
        });

        // Discounts (Phase 7)
        Route::prefix('discounts')->group(function () {
            Route::get('/validate', [PosController::class, 'validateDiscount'])->middleware(['permission:pos.discount.apply,pos.checkout']);
        });

        // Receipts & Vouchers (Phase 8)
        Route::prefix('receipts')->group(function () {
            Route::get('/{sale_id}', [ReceiptController::class, 'show'])->middleware(['permission:receipts.view,receipts.print']);
            Route::post('/{sale_id}/print', [ReceiptController::class, 'print'])->middleware(['permission:receipts.print']);
            
            // Templates (Admin/Owner only)
            Route::middleware(['role:admin,owner'])->group(function () {
                Route::get('/templates', [ReceiptController::class, 'getTemplates']);
                Route::put('/templates/{id}', [ReceiptController::class, 'updateTemplate']);
                Route::get('/logs', [ReceiptController::class, 'getPrintLogs']);
            });
        });

        // Customers & Warranty (Phase 9)
        Route::prefix('customers')->group(function () {
            Route::get('/', [CustomerController::class, 'index'])->middleware(['permission:customers.view,customers.create']);
            Route::post('/', [CustomerController::class, 'store'])->middleware(['permission:customers.create']);
            Route::get('/{customer}', [CustomerController::class, 'show'])->middleware(['permission:customers.view']);
            Route::put('/{customer}', [CustomerController::class, 'update'])->middleware(['permission:customers.create']);
            Route::delete('/{customer}', [CustomerController::class, 'destroy'])->middleware(['permission:customers.create']);
            Route::get('/{customer}/history', [CustomerController::class, 'history'])->middleware(['permission:customers.view']);
        });

        Route::prefix('warranties')->group(function () {
            Route::get('/serial/{serialCode}', [CustomerController::class, 'warrantyBySerial'])->middleware(['permission:warranties.view']);
            Route::get('/expiring', [CustomerController::class, 'expiringWarranties'])->middleware(['role:admin,owner', 'permission:warranties.view']);
            Route::get('/{warranty}', [CustomerController::class, 'showWarranty'])->middleware(['permission:warranties.view']);
            Route::post('/{warranty}/claim', [CustomerController::class, 'submitClaim'])->middleware(['permission:warranties.claim']);
            Route::post('/{warranty}/void', [CustomerController::class, 'voidWarranty'])->middleware(['role:admin,owner', 'permission:warranties.claim']);
        });

        Route::prefix('repairs')->group(function () {
            Route::get('/', [CustomerController::class, 'getRepairs'])->middleware(['permission:repairs.manage']);
            Route::get('/stats', [CustomerController::class, 'repairStats'])->middleware(['permission:repairs.manage']);
            Route::get('/overdue', [CustomerController::class, 'overdueRepairs'])->middleware(['role:admin,owner', 'permission:repairs.manage']);
            Route::patch('/{repairJob}', [CustomerController::class, 'updateRepairStatus'])->middleware(['permission:repairs.manage']);
            Route::get('/technician/{technicianId}', [CustomerController::class, 'repairsByTechnician'])->middleware(['permission:repairs.manage']);
        });

        // Reports (Phase 10)
        Route::prefix('reports')->controller(\App\Http\Controllers\Api\ReportController::class)->group(function () {
            Route::get('/dashboard', 'dashboard');
            Route::get('/sales', 'sales')->middleware('permission:reports.sales');
            Route::get('/financial', 'financial')->middleware('permission:reports.financial');
            Route::get('/inventory', 'inventory')->middleware('permission:reports.inventory');
            Route::get('/employees', 'employees')->middleware('permission:reports.employee');
            Route::post('/export', 'export')->middleware('permission:reports.export');
            Route::get('/exports/{id}/download', 'download');
            Route::get('/activity', 'activity');   // ← add this line
        });

        // Activity Feed (Phase 10)
        Route::prefix('activity')->group(function () {
            Route::get('/recent', function () {
                return response()->json(['data' => []], 200);
            });
            
        });
    });
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// ==========================================
// Phase 8: Receipt & Voucher Routes
// ==========================================
use App\Http\Controllers\ReceiptController as ReceiptWebController;

Route::middleware(['auth:sanctum', 'role:admin,owner,employee'])->group(function () {
    // Receipts
    Route::get('/receipts/{sale_id}', [ReceiptWebController::class, 'show'])->name('receipts.show');
    Route::post('/receipts/{sale_id}/print', [ReceiptWebController::class, 'print'])->name('receipts.print');
    
    // Templates (Admin/Owner only)
    Route::middleware(['role:admin,owner'])->group(function () {
        Route::get('/receipts/templates', [ReceiptWebController::class, 'getTemplates'])->name('receipts.templates.index');
        Route::put('/receipts/templates/{id}', [ReceiptWebController::class, 'updateTemplate'])->name('receipts.templates.update');
    });
    
    // Print Logs (Admin/Owner only)
    Route::middleware(['role:admin,owner'])->group(function () {
        Route::get('/receipts/logs', [ReceiptWebController::class, 'getPrintLogs'])->name('receipts.logs.index');
    });
});

// ==========================================
// Phase 9: Customer & Warranty Routes
// ==========================================
use App\Http\Controllers\CustomerController as CustomerWebController;

Route::middleware(['auth:sanctum', 'role:admin,owner,employee'])->group(function () {
    // Customers
    Route::apiResource('customers', CustomerWebController::class);
    Route::get('/customers/{customer}/history', [CustomerWebController::class, 'history'])->name('customers.history');
    
    // Warranties
    Route::get('/warranties/serial/{serialCode}', [CustomerWebController::class, 'warrantyBySerial'])->name('warranties.serial');
    Route::post('/warranties/{warranty}/claim', [CustomerWebController::class, 'submitClaim'])->name('warranties.claim');
    Route::post('/warranties/{warranty}/void', [CustomerWebController::class, 'voidWarranty'])->name('warranties.void')->middleware('role:admin,owner');
    
    // Repair Jobs
    Route::get('/repairs', [CustomerWebController::class, 'getRepairs'])->name('repairs.index');
    Route::get('/repairs/stats', [CustomerWebController::class, 'repairStats'])->name('repairs.stats');
    Route::get('/repairs/overdue', [CustomerWebController::class, 'overdueRepairs'])->name('repairs.overdue')->middleware('role:admin,owner');
    Route::patch('/repairs/{repairJob}', [CustomerWebController::class, 'updateRepairStatus'])->name('repairs.update');
    Route::get('/repairs/technician/{technicianId}', [CustomerWebController::class, 'repairsByTechnician'])->name('repairs.technician');
    
    // Expiring Warranties (Admin/Owner)
    Route::get('/warranties/expiring', [CustomerWebController::class, 'expiringWarranties'])->name('warranties.expiring')->middleware('role:admin,owner');
});

// ==========================================
// Phase 10: Reports & Analytics
// ==========================================
Route::middleware(['auth:sanctum', 'role:admin,owner,employee'])->group(function () {
    Route::prefix('reports')->controller(\App\Http\Controllers\Api\ReportController::class)->group(function () {
        Route::get('/dashboard', 'dashboard');
        Route::get('/sales', 'sales')->middleware('permission:reports.sales');
        Route::get('/financial', 'financial')->middleware('permission:reports.financial');
        Route::get('/inventory', 'inventory')->middleware('permission:reports.inventory');
        Route::get('/employees', 'employees')->middleware('permission:reports.employee');
        Route::post('/export', 'export')->middleware('permission:reports.export');
        Route::get('/exports/{id}/download', 'download');
    });
});
