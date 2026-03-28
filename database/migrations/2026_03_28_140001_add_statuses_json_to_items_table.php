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
            $table->json('statuses')->nullable()->after('barcode');
        });

        $items = DB::table('items')->select('id', 'barcode', 'status')->get();
        foreach ($items as $row) {
            $codes = json_decode($row->barcode, true);
            if (! is_array($codes)) {
                $codes = [];
            }
            $n = count($codes);
            $slot = $row->status === 'inactive' ? 'inactive' : 'active';
            $statuses = $n > 0
                ? array_fill(0, $n, $slot)
                : [$slot];

            DB::table('items')->where('id', $row->id)->update([
                'statuses' => json_encode(array_values($statuses)),
            ]);
        }
    }

    public function down(): void
    {
        Schema::table('items', function (Blueprint $table) {
            $table->dropColumn('statuses');
        });
    }
};
