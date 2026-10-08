<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TransportOffer extends Model
{
    use HasFactory;
    protected $fillable = ['user_id','vehicle_id','departure','destination','offer_date','capacity_tonnes','available_capacity_tonnes','accepted_cargo_type','pricing_mode','price_amount','additional_information','status'];
    protected function casts(): array { return ['offer_date'=>'date','capacity_tonnes'=>'decimal:3','available_capacity_tonnes'=>'decimal:3','price_amount'=>'decimal:2']; }
    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function vehicle(): BelongsTo { return $this->belongsTo(Vehicle::class); }
}
