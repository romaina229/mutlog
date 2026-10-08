<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transport_requests', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('departure', 120);
            $table->string('destination', 120);
            $table->date('desired_date');
            $table->string('cargo_type', 120);
            $table->decimal('weight_kg', 12, 3);
            $table->decimal('volume_m3', 12, 3)->nullable();
            $table->unsignedInteger('package_count')->nullable();
            $table->text('special_instructions')->nullable();
            $table->string('contact_phone', 30);
            $table->string('status', 30)->default('demande')->index();
            $table->timestamps();

            $table->index(['departure', 'destination', 'desired_date']);
            $table->index(['cargo_type', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transport_requests');
    }
};
