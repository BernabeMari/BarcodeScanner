<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Request extends Model
{
    protected $fillable = [
        'user_id',
        'message',
        'request_type',
        'status',
        'request_quantity',
        'single_break_lines',
        'admin_break_allocations',
        'item_barcode',
        'item_barcodes',
        'approved_at',
        'rejected_at',
        'cancelled_at',
        'issued_at',
        'issuance_cancelled_at',
    ];

    protected $casts = [
        'item_barcodes' => 'array',
        'single_break_lines' => 'array',
        'admin_break_allocations' => 'array',
        'message' => 'array',
        'request_quantity' => 'array',
        'approved_at' => 'datetime',
        'rejected_at' => 'datetime',
        'cancelled_at' => 'datetime',
        'issued_at' => 'datetime',
        'issuance_cancelled_at' => 'datetime',
    ];

    protected $appends = ['verified_items'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getVerifiedItemsAttribute(): array
    {
        if ($this->request_type === 'single' && is_array($this->admin_break_allocations) && count($this->admin_break_allocations) > 0) {
            $result = [];
            foreach ($this->admin_break_allocations as $line) {
                $result[] = [
                    'product_name' => $line['product_name'] ?? '',
                    'barcode' => $line['barcode'] ?? '',
                    'issued_quantity' => (int) ($line['quantity'] ?? 0),
                    'quantity_piece' => (int) ($line['quantity'] ?? 0),
                ];
            }

            return $result;
        }

        if ($this->request_type === 'single' && is_array($this->single_break_lines) && count($this->single_break_lines) > 0) {
            $result = [];
            foreach ($this->single_break_lines as $line) {
                $result[] = [
                    'product_name' => $line['product_name'] ?? '',
                    'barcode' => $line['barcode'] ?? '',
                    'issued_quantity' => (int) ($line['quantity'] ?? 0),
                    'quantity_piece' => (int) ($line['quantity'] ?? 0),
                ];
            }

            return $result;
        }

        $barcodes = $this->item_barcodes ?? [];

        if (count($barcodes) === 0 && $this->item_barcode) {
            $barcodes = [$this->item_barcode];
        }

        if (count($barcodes) === 0) {
            return [];
        }

        $result = [];
        foreach ($barcodes as $b) {
            $item = Item::whereBarcodeContains($b)->first();
            if ($item) {
                $row = $item->toArray();
                $row['barcode'] = $b;
                $row['barcode_slot_status'] = $item->barcodeIsActive($b) ? 'active' : 'inactive';

                $result[] = $row;
            }
        }

        return $result;
    }
}
