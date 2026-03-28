<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    protected $fillable = [
        'barcode',
        'product_name',
        'quantity_pack',
        'quantity_piece',
        'status',
        'break'
    ];
}
