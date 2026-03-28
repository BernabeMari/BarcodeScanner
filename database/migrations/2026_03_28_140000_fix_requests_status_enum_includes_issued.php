<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Migration 2026_03_21_044000 reset the enum and dropped "issued" / "issuance_cancelled".
     */
    public function up(): void
    {
        DB::statement(
            "ALTER TABLE `requests` 
             MODIFY `status` ENUM(
                'pending',
                'approved',
                'rejected',
                'cancelled',
                'issued',
                'issuance_cancelled'
             ) NOT NULL DEFAULT 'pending'"
        );
    }

    public function down(): void
    {
        DB::statement(
            "ALTER TABLE `requests` 
             MODIFY `status` ENUM('pending','approved','rejected','cancelled') 
             NOT NULL DEFAULT 'pending'"
        );
    }
};
