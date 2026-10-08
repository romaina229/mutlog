<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vehicle extends Model
{
    use HasFactory;
    protected $fillable = ['user_id','vehicle_type','brand','registration','capacity_tonnes','available_volume_m3','accepted_cargo_type','is_available'];
    protected function casts(): array { return ['capacity_tonnes'=>'decimal:3','available_volume_m3'=>'decimal:3','is_available'=>'boolean']; }
    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function transportOffers(): HasMany { return $this->hasMany(TransportOffer::class); }
}
