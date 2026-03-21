<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Request extends Model
{
    protected $fillable = [
        'user_id',
        'message',
        'status',
        'item_barcode',
        'item_barcodes',
        'approved_at',
        'rejected_at',
        'cancelled_at',
    ];

    protected $casts = [
        'item_barcodes' => 'array',
        'approved_at' => 'datetime',
        'rejected_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    protected $appends = ['verified_items'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getVerifiedItemsAttribute(): array
    {
        $barcodes = $this->item_barcodes ?? [];

        if (count($barcodes) === 0 && $this->item_barcode) {
            $barcodes = [$this->item_barcode];
        }

        if (count($barcodes) === 0) {
            return [];
        }

        return Item::whereIn('barcode', $barcodes)->get()->values()->all();
    }
}
