<?php

namespace App\Listeners;

use App\Events\SaleCompleted;
use App\Services\WarrantyService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class GenerateWarranty implements ShouldQueue
{
    use InteractsWithQueue;

    protected WarrantyService $warrantyService;

    /**
     * Create the event listener.
     */
    public function __construct(WarrantyService $warrantyService)
    {
        $this->warrantyService = $warrantyService;
    }

    /**
     * Handle the event.
     */
    public function handle(SaleCompleted $event): void
    {
        $this->warrantyService->generateForSale($event->sale);
    }
}
