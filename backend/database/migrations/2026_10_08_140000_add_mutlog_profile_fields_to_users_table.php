<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->string('phone', 30)->unique()->after('name');
            $table->string('address')->after('phone');
            $table->string('city', 120)->after('address');
            $table->string('user_type', 30)->default('client')->after('city')->index();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropIndex(['user_type']);
            $table->dropUnique(['phone']);
            $table->dropColumn(['phone', 'address', 'city', 'user_type']);
        });
    }
};
