<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

Route::middleware(['auth', 'role:admin'])->controller(ItemController::class)->group(function(){
    Route::get('/admin', 'adminPage')->name('admin_page');
    Route::get('/Items', 'itemPage')->name('items_page');
    Route::get('/scan', 'scanPage')->name('scanner_page');
    Route::get('/search/{barcode?}', 'searchPage')->name('search_page');
    Route::post('/scan-product', 'scan');
    Route::get('/CreateUser', 'CreateUserPage')->name('create_user_page');
    Route::post('/create-product', 'create_item')->name('create_item');
    Route::get('/inactive-items', 'inactive_items_page')->name('inactive_items_page');
    Route::get('/requests', 'requestsPage')->name('requests_page');
    Route::get('/requests/done', 'requestsDonePage')->name('requests_done_page');
    Route::get('/requests/audit-logs', 'auditLogsPage')->name('requests_audit_logs_page');
    Route::post('/requests/{id}/verify-item', 'verifyRequestItem')->name('verify_request_item');
    Route::post('/update-request/{id}', 'updateRequest')->name('update_request');
    Route::post('/requests/{id}/mark-issued', 'markRequestIssued')->name('mark_request_issued');
    Route::post('/requests/{id}/cancel-issuance', 'cancelRequestIssuance')->name('cancel_request_issuance');
    Route::post('/requests/{id}/remove-verified-item', 'removeVerifiedItem')->name('remove_verified_item');
});

Route::middleware(['auth', 'role:employee'])->controller(ItemController::class)->group(function(){
    Route::get('/employee', 'employeePage')->name('employee_page');
    Route::get('/employee/my-requests', 'employeeMyRequestsPage')->name('employee_my_requests');
    Route::post('/requests/{id}/cancel', 'cancelRequest')->name('cancel_request');
    Route::post('/submit-request', 'submitRequest')->name('submit_request');
    Route::get('/requests/{id}/receipt-preview', 'receiptPreview')->name('receipt_preview');
    Route::get('/requests/{id}/receipt', 'generateReceipt')->name('generate_receipt');
});

Route::controller(UserController::class)->group(function(){
    Route::post('/CreateUser', 'create_user')->name('create_user');
    Route::post('/login', 'login')->name('login');
    Route::get('/', 'login_page')->name('login_page');
});

