<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('items', function (Blueprint $table) {
            $table->unsignedInteger('break_initial_pieces')->nullable()->after('break');
        });

        DB::table('items')
            ->where('break', 'break')
            ->whereNull('break_initial_pieces')
            ->update(['break_initial_pieces' => DB::raw('quantity_pack')]);
    }

    public function down(): void
    {
        Schema::table('items', function (Blueprint $table) {
            $table->dropColumn('break_initial_pieces');
        });
    }
};
