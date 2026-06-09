<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GoodsReceiptItem extends Model
{
    protected $fillable = [
        'goods_receipt_id',
        'po_item_id',
        'quantity_received',
        'serial_numbers',
        'condition',
    ];

    protected $casts = [
        'quantity_received' => 'integer',
        'serial_numbers' => 'array',
    ];

    public function goodsReceipt(): BelongsTo
    {
        return $this->belongsTo(GoodsReceipt::class);
    }

    public function purchaseOrderItem(): BelongsTo
    {
        return $this->belongsTo(PurchaseOrderItem::class, 'po_item_id');
    }

    public function isDamaged(): bool
    {
        return $this->condition === 'damaged';
    }
}
