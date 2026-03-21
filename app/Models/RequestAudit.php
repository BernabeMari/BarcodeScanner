<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RequestAudit extends Model
{
    protected $fillable = [
        'request_id',
        'actor_user_id',
        'action',
        'from_status',
        'to_status',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function request(): BelongsTo
    {
        return $this->belongsTo(Request::class);
    }

    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_user_id');
    }
}

