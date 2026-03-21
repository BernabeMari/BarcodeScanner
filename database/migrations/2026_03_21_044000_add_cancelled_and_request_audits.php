<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('requests', function (Blueprint $table) {
            $table->timestamp('cancelled_at')->nullable()->after('rejected_at');
        });

        // Extend enum so we can store "cancelled"
        DB::statement(
            "ALTER TABLE `requests` 
             MODIFY `status` ENUM('pending','approved','rejected','cancelled') 
             NOT NULL DEFAULT 'pending'"
        );

        Schema::create('request_audits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('request_id')->constrained('requests')->onDelete('cascade');
            $table->foreignId('actor_user_id')->constrained('users')->onDelete('cascade');
            $table->string('action');
            $table->string('from_status')->nullable();
            $table->string('to_status')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('request_audits');

        DB::statement(
            "ALTER TABLE `requests` 
             MODIFY `status` ENUM('pending','approved','rejected') 
             NOT NULL DEFAULT 'pending'"
        );

        Schema::table('requests', function (Blueprint $table) {
            $table->dropColumn('cancelled_at');
        });
    }
};

