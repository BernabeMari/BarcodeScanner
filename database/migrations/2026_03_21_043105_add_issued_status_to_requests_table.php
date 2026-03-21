<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('requests', function (Blueprint $table) {
            $table->timestamp('issued_at')->nullable()->after('cancelled_at');
            $table->timestamp('issuance_cancelled_at')->nullable()->after('issued_at');
        });

        // Extend enum to include "issued" and "issuance_cancelled"
        DB::statement(
            "ALTER TABLE `requests` 
             MODIFY `status` ENUM('pending','approved','rejected','cancelled','issued','issuance_cancelled') 
             NOT NULL DEFAULT 'pending'"
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement(
            "ALTER TABLE `requests` 
             MODIFY `status` ENUM('pending','approved','rejected','cancelled') 
             NOT NULL DEFAULT 'pending'"
        );

        Schema::table('requests', function (Blueprint $table) {
            $table->dropColumn(['issued_at', 'issuance_cancelled_at']);
        });
    }
};
