<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
 public function up(): void { Schema::create('transport_offers', function (Blueprint $table): void { $table->id(); $table->foreignId('user_id')->constrained('users')->cascadeOnDelete(); $table->foreignId('vehicle_id')->constrained('vehicles')->cascadeOnDelete(); $table->string('departure',120); $table->string('destination',120); $table->date('offer_date'); $table->decimal('capacity_tonnes',10,3); $table->decimal('available_capacity_tonnes',10,3); $table->string('accepted_cargo_type',120); $table->string('pricing_mode',30); $table->decimal('price_amount',14,2)->nullable(); $table->text('additional_information')->nullable(); $table->string('status',30)->default('active')->index(); $table->timestamps(); $table->index(['departure','destination','offer_date','status']); }); }
 public function down(): void { Schema::dropIfExists('transport_offers'); }
};
