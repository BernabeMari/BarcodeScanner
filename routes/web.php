<?php

use App\Http\Controllers\ItemController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::controller(ItemController::class)->group(function(){
    Route::get('/', 'scanPage')->name('admin_page');
    Route::post('/scan-product', 'scan');
    Route::post('/create-product', 'create_item')->name('create_item');
});