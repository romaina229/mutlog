<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TransportRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'departure',
        'destination',
        'desired_date',
        'cargo_type',
        'weight_kg',
        'volume_m3',
        'package_count',
        'special_instructions',
        'contact_phone',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'desired_date' => 'date',
            'weight_kg' => 'decimal:3',
            'volume_m3' => 'decimal:3',
            'package_count' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
