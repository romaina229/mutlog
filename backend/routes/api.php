<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TransportRequestController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function (): void {
    Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:6,1');
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:6,1');

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);

        Route::prefix('client')->group(function (): void {
            Route::get('/requests', [TransportRequestController::class, 'index']);
            Route::post('/requests', [TransportRequestController::class, 'store']);
            Route::get('/requests/{transportRequest}', [TransportRequestController::class, 'show']);
        });
    });
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
