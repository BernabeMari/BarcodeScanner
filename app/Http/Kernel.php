<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    /**
     * The application's route middleware.
     *
     * @var array<string, class-string>
     */
    protected $routeMiddleware = [
        'role' => \App\Http\Middleware\UserIsAdmin::class,  
    ];
}