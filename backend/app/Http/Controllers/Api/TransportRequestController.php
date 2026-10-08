<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TransportRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TransportRequestController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'data' => $request->user()->transportRequests()->latest()->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'departure' => ['required', 'string', 'max:120'],
            'destination' => ['required', 'string', 'max:120', 'different:departure'],
            'desired_date' => ['required', 'date', 'after_or_equal:today'],
            'cargo_type' => ['required', 'string', 'max:120'],
            'weight_kg' => ['required', 'numeric', 'gt:0', 'max:999999999'],
            'volume_m3' => ['nullable', 'numeric', 'gt:0', 'max:999999999'],
            'package_count' => ['nullable', 'integer', 'min:1', 'max:4294967295'],
            'special_instructions' => ['nullable', 'string', 'max:5000'],
            'contact_phone' => ['required', 'string', 'max:30'],
        ]);

        $transportRequest = $request->user()->transportRequests()->create([
            ...$validated,
            'status' => 'demande',
        ]);

        return response()->json([
            'message' => 'Demande de transport publiée avec succès.',
            'data' => $transportRequest,
        ], 201);
    }

    public function show(Request $request, TransportRequest $transportRequest): JsonResponse
    {
        abort_unless($transportRequest->user_id === $request->user()->id, 404);

        return response()->json([
            'data' => $transportRequest,
        ]);
    }
}
