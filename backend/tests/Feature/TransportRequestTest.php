<?php

namespace Tests\Feature;

use App\Models\TransportRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TransportRequestTest extends TestCase
{
    use RefreshDatabase;

    public function test_client_can_publish_a_transport_request(): void
    {
        $user = User::factory()->create(['user_type' => 'client']);

        $response = $this->actingAs($user, 'web')->postJson('/api/client/requests', [
            'departure' => 'Lokossa',
            'destination' => 'Cotonou',
            'desired_date' => now()->addDays(7)->toDateString(),
            'cargo_type' => 'Produit agricole',
            'weight_kg' => 1000,
            'volume_m3' => 2.5,
            'package_count' => 20,
            'special_instructions' => 'Bâchage souhaité.',
            'contact_phone' => '+229 97000000',
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.departure', 'Lokossa')
            ->assertJsonPath('data.destination', 'Cotonou')
            ->assertJsonPath('data.status', 'demande');

        $this->assertDatabaseHas('transport_requests', [
            'user_id' => $user->id,
            'departure' => 'Lokossa',
            'destination' => 'Cotonou',
            'status' => 'demande',
        ]);
    }

    public function test_request_validation_rejects_invalid_data(): void
    {
        $user = User::factory()->create(['user_type' => 'client']);

        $this->actingAs($user, 'web')
            ->postJson('/api/client/requests', [
                'departure' => 'Cotonou',
                'destination' => 'Cotonou',
                'desired_date' => now()->subDay()->toDateString(),
                'cargo_type' => 'Marchandise',
                'weight_kg' => 0,
                'contact_phone' => '',
            ])
            ->assertUnprocessable();
    }

    public function test_client_lists_only_their_requests(): void
    {
        $user = User::factory()->create(['user_type' => 'client']);
        $other = User::factory()->create(['user_type' => 'client']);

        TransportRequest::create([
            'user_id' => $user->id,
            'departure' => 'Lokossa',
            'destination' => 'Cotonou',
            'desired_date' => now()->addDays(2)->toDateString(),
            'cargo_type' => 'Produit agricole',
            'weight_kg' => 1000,
            'contact_phone' => $user->phone,
            'status' => 'demande',
        ]);

        TransportRequest::create([
            'user_id' => $other->id,
            'departure' => 'Parakou',
            'destination' => 'Cotonou',
            'desired_date' => now()->addDays(3)->toDateString(),
            'cargo_type' => 'Marchandise',
            'weight_kg' => 500,
            'contact_phone' => $other->phone,
            'status' => 'demande',
        ]);

        $response = $this->actingAs($user, 'web')->getJson('/api/client/requests');

        $response->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.user_id', $user->id);
    }

    public function test_client_cannot_read_another_clients_request(): void
    {
        $user = User::factory()->create(['user_type' => 'client']);
        $other = User::factory()->create(['user_type' => 'client']);

        $request = TransportRequest::create([
            'user_id' => $other->id,
            'departure' => 'Parakou',
            'destination' => 'Cotonou',
            'desired_date' => now()->addDays(3)->toDateString(),
            'cargo_type' => 'Marchandise',
            'weight_kg' => 500,
            'contact_phone' => $other->phone,
            'status' => 'demande',
        ]);

        $this->actingAs($user, 'web')
            ->getJson('/api/client/requests/'.$request->id)
            ->assertNotFound();
    }
}
