<?php

namespace App\Listeners;

use App\Events\SaleCompleted;
use App\Services\InventoryService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class DeductInventory implements ShouldQueue
{
    use InteractsWithQueue;

    protected InventoryService $inventoryService;

    /**
     * Create the event listener.
     */
    public function __construct(InventoryService $inventoryService)
    {
        $this->inventoryService = $inventoryService;
    }

    /**
     * Handle the event.
     */
    public function handle(SaleCompleted $event): void
    {
        $this->inventoryService->deductForSale($event->sale);
    }
}
