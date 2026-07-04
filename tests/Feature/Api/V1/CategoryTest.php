<?php

use App\Models\Category;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

/*
 * Testes de Categorias (CategoryController)
 *
 * Cobre:
 *   - CRUD completo (index, store, show, update, destroy)
 *   - Isolamento entre usuários (não ver categorias de outro)
 *   - Validações (nome único por usuário, cor hexadecimal)
 */

test('lista categorias do usuário autenticado', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    Category::factory()->count(3)->create(['user_id' => $user->id]);

    $response = $this->getJson('/api/v1/categories');

    $response->assertStatus(200)
        ->assertJsonCount(3, 'data');
});

test('não lista categorias de outros usuários', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    Sanctum::actingAs($user);

    // Cria categorias para o outro usuário
    Category::factory()->count(2)->create(['user_id' => $otherUser->id]);

    $response = $this->getJson('/api/v1/categories');

    // Usuário logado vê lista vazia
    $response->assertStatus(200)
        ->assertJsonCount(0, 'data');
});

test('cria categoria com sucesso', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $response = $this->postJson('/api/v1/categories', [
        'name' => 'Trabalho',
        'color' => '#ef4444',
    ]);

    $response->assertStatus(201)
        ->assertJson([
            'data' => [
                'name' => 'Trabalho',
                'color' => '#ef4444',
            ],
        ]);

    $this->assertDatabaseHas('categories', [
        'user_id' => $user->id,
        'name' => 'Trabalho',
    ]);
});

test('não permite criar categoria com nome duplicado para o mesmo usuário', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    Category::factory()->create([
        'user_id' => $user->id,
        'name' => 'Trabalho',
    ]);

    $response = $this->postJson('/api/v1/categories', [
        'name' => 'Trabalho',
        'color' => '#3b82f6',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['name']);
});

test('permite categoria com mesmo nome para usuários diferentes', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    Sanctum::actingAs($user);

    Category::factory()->create([
        'user_id' => $otherUser->id,
        'name' => 'Trabalho',
    ]);

    $response = $this->postJson('/api/v1/categories', [
        'name' => 'Trabalho',
        'color' => '#10b981',
    ]);

    $response->assertStatus(201);
});

test('mostra categoria específica', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $category = Category::factory()->create([
        'user_id' => $user->id,
        'name' => 'Estudos',
    ]);

    $response = $this->getJson("/api/v1/categories/{$category->id}");

    $response->assertStatus(200)
        ->assertJson([
            'data' => ['name' => 'Estudos'],
        ]);
});

test('não permite ver categoria de outro usuário', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    Sanctum::actingAs($user);

    $category = Category::factory()->create(['user_id' => $otherUser->id]);

    $response = $this->getJson("/api/v1/categories/{$category->id}");

    $response->assertStatus(404);
});

test('atualiza categoria', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $category = Category::factory()->create([
        'user_id' => $user->id,
        'name' => 'Antigo',
        'color' => '#000000',
    ]);

    $response = $this->putJson("/api/v1/categories/{$category->id}", [
        'name' => 'Novo Nome',
        'color' => '#ffffff',
    ]);

    $response->assertStatus(200)
        ->assertJson([
            'data' => [
                'name' => 'Novo Nome',
                'color' => '#ffffff',
            ],
        ]);
});

test('exclui categoria', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $category = Category::factory()->create(['user_id' => $user->id]);

    $response = $this->deleteJson("/api/v1/categories/{$category->id}");

    $response->assertStatus(204);

    $this->assertDatabaseMissing('categories', ['id' => $category->id]);
});
