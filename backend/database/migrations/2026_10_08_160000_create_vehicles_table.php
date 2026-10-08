<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
 public function up(): void { Schema::create('vehicles', function (Blueprint $table): void { $table->id(); $table->foreignId('user_id')->constrained('users')->cascadeOnDelete(); $table->string('vehicle_type',100); $table->string('brand',100); $table->string('registration',40); $table->decimal('capacity_tonnes',10,3); $table->decimal('available_volume_m3',10,3)->nullable(); $table->string('accepted_cargo_type',120); $table->boolean('is_available')->default(true)->index(); $table->timestamps(); $table->index(['user_id','is_available']); $table->unique(['user_id','registration']); }); }
 public function down(): void { Schema::dropIfExists('vehicles'); }
};
