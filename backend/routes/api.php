<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TransportRequestController;
use App\Http\Controllers\Api\TransporterController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('web')->group(function (): void {
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
                Route::get('/requests/{transportRequest}/matches', [TransporterController::class, 'matches']);
            });

            Route::prefix('transporter')->group(function (): void {
                Route::get('/vehicles', [TransporterController::class, 'vehicles']);
                Route::post('/vehicles', [TransporterController::class, 'storeVehicle']);
                Route::put('/vehicles/{vehicle}', [TransporterController::class, 'updateVehicle']);
                Route::get('/offers', [TransporterController::class, 'offers']);
                Route::post('/offers', [TransporterController::class, 'storeOffer']);
                Route::put('/offers/{transportOffer}', [TransporterController::class, 'updateOffer']);
            });
        });
    });

    Route::get('/user', fn (Request $request) => $request->user())
        ->middleware('auth:sanctum');
});
