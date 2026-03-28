<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\ValidationException;

class Item extends Model
{
    protected $fillable = [
        'barcode',
        'statuses',
        'product_name',
        'quantity_pack',
        'quantity_piece',
        'status',
        'break',
    ];

    protected $casts = [
        'barcode' => 'array',
        'statuses' => 'array',
    ];

    protected static function booted(): void
    {
        static::saving(function (Item $item) {
            $item->ensureStatusesAligned();
            $item->status = $item->computeAggregateStatus();
        });
    }

    /**
     * Keep statuses[] the same length as barcode[]; normalize values.
     */
    public function ensureStatusesAligned(): void
    {
        $codes = array_values(array_filter(
            $this->barcode ?? [],
            fn ($c) => $c !== null && trim((string) $c) !== ''
        ));
        $n = count($codes);
        $statuses = is_array($this->statuses) ? array_values($this->statuses) : [];

        if ($n === 0) {
            $this->statuses = [];

            return;
        }

        if (count($statuses) !== $n) {
            $fallback = (($this->status ?? 'active') === 'inactive') ? 'inactive' : 'active';
            $this->statuses = array_fill(0, $n, $fallback);

            return;
        }

        foreach ($statuses as $i => $s) {
            if ($s !== 'active' && $s !== 'inactive') {
                $statuses[$i] = 'active';
            }
        }
        $this->statuses = $statuses;
    }

    /**
     * Row-level status: active if any barcode slot is active.
     */
    public function computeAggregateStatus(): string
    {
        $statuses = $this->statuses ?? [];
        foreach ($statuses as $s) {
            if ($s === 'active') {
                return 'active';
            }
        }

        return 'inactive';
    }

    public function indexOfBarcode(string $barcode): ?int
    {
        $needle = trim($barcode);
        $codes = array_values(array_filter(
            $this->barcode ?? [],
            fn ($c) => $c !== null && trim((string) $c) !== ''
        ));
        foreach ($codes as $i => $c) {
            if (trim((string) $c) === $needle) {
                return $i;
            }
        }

        return null;
    }

    public function barcodeIsActive(string $barcode): bool
    {
        $i = $this->indexOfBarcode($barcode);
        if ($i === null) {
            return false;
        }
        $statuses = $this->statuses ?? [];

        return ($statuses[$i] ?? 'active') === 'active';
    }

    public function setBarcodeStatus(string $barcode, string $newStatus): void
    {
        if ($newStatus !== 'active' && $newStatus !== 'inactive') {
            return;
        }
        $i = $this->indexOfBarcode($barcode);
        if ($i === null) {
            return;
        }
        $this->ensureStatusesAligned();
        $statuses = array_values($this->statuses ?? []);
        $statuses[$i] = $newStatus;
        $this->statuses = $statuses;
    }

    public function scopeWhereBarcodeContains(Builder $query, string $value): Builder
    {
        return $query->whereJsonContains('barcode', $value);
    }

    public static function barcodeStringInUse(string $barcode, ?int $exceptItemId = null): bool
    {
        $barcode = trim($barcode);
        if ($barcode === '') {
            return false;
        }

        $q = static::whereBarcodeContains($barcode);
        if ($exceptItemId !== null) {
            $q->where('id', '!=', $exceptItemId);
        }

        return $q->exists();
    }

    public static function assertUniqueBarcodes(array $barcodes, ?int $exceptItemId = null): void
    {
        $normalized = [];
        foreach ($barcodes as $b) {
            $t = trim((string) $b);
            if ($t === '') {
                continue;
            }
            $normalized[] = $t;
        }

        if (count($normalized) !== count(array_unique($normalized))) {
            throw ValidationException::withMessages([
                'barcode' => 'Duplicate barcodes are not allowed on the same item.',
            ]);
        }

        foreach ($normalized as $b) {
            if (static::barcodeStringInUse($b, $exceptItemId)) {
                throw ValidationException::withMessages([
                    'barcode' => "Barcode {$b} is already used on another item.",
                ]);
            }
        }
    }
}
