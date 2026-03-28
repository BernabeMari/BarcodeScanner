<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('items', function (Blueprint $table) {
            $table->id();
            $table->string('barcode')->unique();
            $table->string('product_name');
            $table->integer('quantity_pack')->default(0);
            $table->integer('quantity_piece')->default(0);
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->enum('break', ['break', 'not_break'])->default('not_break');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};
