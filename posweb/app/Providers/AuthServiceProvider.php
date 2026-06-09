<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Models\User;
use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;
use App\Models\InventoryItem;
use App\Models\SerialNumber;
use App\Models\PurchaseOrder;
use App\Models\Supplier;
use App\Models\Sale;
use App\Models\Customer;
use App\Models\Warranty;
use App\Models\RepairJob;
use App\Models\Receipt;
use App\Policies\UserPolicy;
use App\Policies\ProductPolicy;
use App\Policies\CategoryPolicy;
use App\Policies\BrandPolicy;
use App\Policies\InventoryItemPolicy;
use App\Policies\SerialNumberPolicy;
use App\Policies\PurchaseOrderPolicy;
use App\Policies\SupplierPolicy;
use App\Policies\SalePolicy;
use App\Policies\CustomerPolicy;
use App\Policies\WarrantyPolicy;
use App\Policies\RepairJobPolicy;
use App\Policies\ReceiptPolicy;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        User::class => UserPolicy::class,
        Product::class => ProductPolicy::class,
        Category::class => CategoryPolicy::class,
        Brand::class => BrandPolicy::class,
        InventoryItem::class => InventoryItemPolicy::class,
        SerialNumber::class => SerialNumberPolicy::class,
        PurchaseOrder::class => PurchaseOrderPolicy::class,
        Supplier::class => SupplierPolicy::class,
        Sale::class => SalePolicy::class,
        Customer::class => CustomerPolicy::class,
        Warranty::class => WarrantyPolicy::class,
        RepairJob::class => RepairJobPolicy::class,
        Receipt::class => ReceiptPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();
    }
}
        // Phase 10: Report Policies
        $this->policy(\App\Models\Sale::class, \App\Policies\ReportPolicy::class);
        $this->policy(\App\Models\InventoryItem::class, \App\Policies\ReportPolicy::class);
