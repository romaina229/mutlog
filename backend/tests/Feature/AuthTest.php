<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\PersonalAccessToken;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_client_can_register_with_required_mutlog_profile_fields(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Jean Dupont',
            'phone' => '+229 97000000',
            'address' => 'Quartier Zongo',
            'city' => 'Cotonou',
            'user_type' => 'client',
            'email' => 'jean@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('user.phone', '+229 97000000')
            ->assertJsonPath('user.user_type', 'client')
            ->assertJsonPath('token_type', 'Bearer');

        $this->assertDatabaseHas('users', [
            'phone' => '+229 97000000',
            'user_type' => 'client',
        ]);
    }

    public function test_transporteur_can_register(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Transport Benin',
            'phone' => '+229 96000000',
            'address' => 'Akpakpa',
            'city' => 'Cotonou',
            'user_type' => 'transporteur',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);

        $response->assertCreated()->assertJsonPath('user.user_type', 'transporteur');
    }

    public function test_admin_cannot_be_created_through_public_registration(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Admin',
            'phone' => '+229 95000000',
            'address' => 'Cotonou',
            'city' => 'Cotonou',
            'user_type' => 'admin',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);

        $response->assertUnprocessable();
        $this->assertDatabaseCount('users', 0);
    }

    public function test_user_can_login_with_phone_and_password(): void
    {
        $user = User::factory()->create([
            'phone' => '+229 97000001',
            'address' => 'Cadjehoun',
            'city' => 'Cotonou',
            'user_type' => 'client',
            'password' => 'Password123!',
        ]);

        $response = $this->postJson('/api/auth/login', [
            'phone' => $user->phone,
            'password' => 'Password123!',
        ]);

        $response->assertOk()
            ->assertJsonPath('user.id', $user->id)
            ->assertJsonPath('token_type', 'Bearer');

        $this->assertDatabaseCount('personal_access_tokens', 1);
    }

    public function test_invalid_login_is_rejected(): void
    {
        User::factory()->create([
            'phone' => '+229 97000002',
            'address' => 'Fidjrossè',
            'city' => 'Cotonou',
            'user_type' => 'client',
            'password' => 'Password123!',
        ]);

        $this->postJson('/api/auth/login', [
            'phone' => '+229 97000002',
            'password' => 'wrong-password',
        ])->assertUnprocessable();
    }

    public function test_authenticated_user_can_read_profile_and_logout(): void
    {
        $user = User::factory()->create([
            'phone' => '+229 97000003',
            'address' => 'Ganhi',
            'city' => 'Cotonou',
            'user_type' => 'transporteur',
        ]);

        $token = $user->createToken('test')->plainTextToken;

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/auth/me')
            ->assertOk()
            ->assertJsonPath('user.id', $user->id);

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/auth/logout')
            ->assertOk();

        $this->assertSame(0, PersonalAccessToken::where('tokenable_id', $user->id)->count());
    }

    public function test_protected_profile_requires_authentication(): void
    {
        $this->getJson('/api/auth/me')->assertUnauthorized();
    }
}
