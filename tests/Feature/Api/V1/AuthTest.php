<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;

/*
 * Testes de Autenticação (AuthController)
 *
 * Cobre:
 *   - Cadastro bem-sucedido
 *   - Cadastro com dados inválidos (validação)
 *   - Login bem-sucedido
 *   - Login com credenciais inválidas
 *   - Logout
 *   - Acesso a rota protegida sem token
 */

test('usuário pode se cadastrar', function () {
    $response = $this->postJson('/api/v1/register', [
        'name' => 'Novo Usuário',
        'email' => 'novo@example.com',
        'password' => 'Password123',
        'password_confirmation' => 'Password123',
    ]);

    $response->assertStatus(201)
        ->assertJsonStructure([
            'user' => ['id', 'name', 'email'],
            'token',
        ]);

    $this->assertDatabaseHas('users', [
        'email' => 'novo@example.com',
    ]);
});

test('cadastro com email duplicado retorna erro', function () {
    User::factory()->create(['email' => 'existente@example.com']);

    $response = $this->postJson('/api/v1/register', [
        'name' => 'Outro Usuário',
        'email' => 'existente@example.com',
        'password' => 'Password123',
        'password_confirmation' => 'Password123',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
});

test('cadastro com senha sem confirmação retorna erro', function () {
    $response = $this->postJson('/api/v1/register', [
        'name' => 'Usuário',
        'email' => 'user@example.com',
        'password' => 'Password123',
        // sem password_confirmation
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['password']);
});

test('usuário pode fazer login', function () {
    $user = User::factory()->create([
        'email' => 'user@example.com',
        'password' => Hash::make('password123'),
    ]);

    $response = $this->postJson('/api/v1/login', [
        'email' => 'user@example.com',
        'password' => 'password123',
    ]);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'user' => ['id', 'name', 'email'],
            'token',
        ]);
});

test('login com senha errada retorna 401', function () {
    $user = User::factory()->create([
        'email' => 'user@example.com',
    ]);

    $response = $this->postJson('/api/v1/login', [
        'email' => 'user@example.com',
        'password' => 'senha_errada',
    ]);

    $response->assertStatus(401)
        ->assertJson(['message' => 'Credenciais inválidas.']);
});

test('usuário pode fazer logout', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $response = $this->postJson('/api/v1/logout');

    $response->assertStatus(200)
        ->assertJson(['message' => 'Logout realizado com sucesso.']);

    // Verifica que o token foi revogado
    $this->assertDatabaseCount('personal_access_tokens', 0);
});

test('usuário autenticado pode ver seus dados', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $response = $this->getJson('/api/v1/user');

    $response->assertStatus(200)
        ->assertJson([
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
});

test('rota protegida sem token retorna 401', function () {
    $response = $this->getJson('/api/v1/user');

    $response->assertStatus(401);
});
