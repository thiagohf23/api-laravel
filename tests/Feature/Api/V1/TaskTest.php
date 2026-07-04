<?php

use App\Enum\TaskPriority;
use App\Enum\TaskStatus;
use App\Models\Category;
use App\Models\Task;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

/*
 * Testes de Tarefas (TaskController)
 *
 * Cobre:
 *   - CRUD completo (index, store, show, update, destroy)
 *   - Filtros (status, priority, search)
 *   - Paginação
 *   - Isolamento entre usuários
 *   - Validações (enum, category_id pertencente ao usuário)
 */

test('lista tarefas do usuário autenticado', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    Task::factory()->count(3)->create(['user_id' => $user->id]);

    $response = $this->getJson('/api/v1/tasks');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'data',
            'meta' => ['current_page', 'last_page', 'per_page', 'total'],
        ]);
});

test('não lista tarefas de outros usuários', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    Sanctum::actingAs($user);

    Task::factory()->count(2)->create(['user_id' => $otherUser->id]);

    $response = $this->getJson('/api/v1/tasks');

    $response->assertStatus(200)
        ->assertJsonPath('meta.total', 0);
});

test('filtra tarefas por status', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    Task::factory()->create(['user_id' => $user->id, 'status' => TaskStatus::Pending]);
    Task::factory()->create(['user_id' => $user->id, 'status' => TaskStatus::Completed]);

    $response = $this->getJson('/api/v1/tasks?status=completed');

    $response->assertStatus(200)
        ->assertJsonPath('meta.total', 1);
});

test('filtra tarefas por prioridade', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    Task::factory()->create(['user_id' => $user->id, 'priority' => TaskPriority::High]);
    Task::factory()->create(['user_id' => $user->id, 'priority' => TaskPriority::Low]);

    $response = $this->getJson('/api/v1/tasks?priority=high');

    $response->assertStatus(200)
        ->assertJsonPath('meta.total', 1);
});

test('filtra tarefas por busca textual', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    Task::factory()->create(['user_id' => $user->id, 'title' => 'Comprar pão']);
    Task::factory()->create(['user_id' => $user->id, 'title' => 'Estudar Laravel']);

    $response = $this->getJson('/api/v1/tasks?search=Comprar');

    $response->assertStatus(200)
        ->assertJsonPath('meta.total', 1);
});

test('cria tarefa com sucesso', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $response = $this->postJson('/api/v1/tasks', [
        'title' => 'Finalizar projeto',
        'description' => 'Terminar a API de tarefas',
        'status' => 'pending',
        'priority' => 'high',
        'due_date' => now()->addDays(7)->format('Y-m-d'),
    ]);

    $response->assertStatus(201)
        ->assertJson([
            'data' => [
                'title' => 'Finalizar projeto',
                'status' => 'pending',
                'priority' => 'high',
            ],
        ]);

    $this->assertDatabaseHas('tasks', [
        'user_id' => $user->id,
        'title' => 'Finalizar projeto',
    ]);
});

test('cria tarefa com categoria válida', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $category = Category::factory()->create(['user_id' => $user->id]);

    $response = $this->postJson('/api/v1/tasks', [
        'title' => 'Tarefa com categoria',
        'category_id' => $category->id,
    ]);

    $response->assertStatus(201)
        ->assertJson([
            'data' => [
                'category_id' => $category->id,
            ],
        ]);
});

test('não permite criar tarefa com categoria de outro usuário', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    Sanctum::actingAs($user);

    $category = Category::factory()->create(['user_id' => $otherUser->id]);

    $response = $this->postJson('/api/v1/tasks', [
        'title' => 'Tarefa inválida',
        'category_id' => $category->id,
    ]);

    $response->assertStatus(422);
});

test('não permite status inválido', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $response = $this->postJson('/api/v1/tasks', [
        'title' => 'Tarefa',
        'status' => 'status_inexistente',
    ]);

    $response->assertStatus(422);
});

test('mostra tarefa específica', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $task = Task::factory()->create([
        'user_id' => $user->id,
        'title' => 'Minha tarefa',
    ]);

    $response = $this->getJson("/api/v1/tasks/{$task->id}");

    $response->assertStatus(200)
        ->assertJson([
            'data' => ['title' => 'Minha tarefa'],
        ]);
});

test('não permite ver tarefa de outro usuário', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    Sanctum::actingAs($user);

    $task = Task::factory()->create(['user_id' => $otherUser->id]);

    $response = $this->getJson("/api/v1/tasks/{$task->id}");

    $response->assertStatus(404);
});

test('atualiza tarefa', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $task = Task::factory()->create([
        'user_id' => $user->id,
        'status' => TaskStatus::Pending,
    ]);

    $response = $this->putJson("/api/v1/tasks/{$task->id}", [
        'status' => 'completed',
    ]);

    $response->assertStatus(200)
        ->assertJson([
            'data' => ['status' => 'completed'],
        ]);
});

test('atualização parcial com PATCH', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $task = Task::factory()->create([
        'user_id' => $user->id,
        'title' => 'Título original',
    ]);

    // Só atualiza o status, o título deve permanecer o mesmo
    $response = $this->putJson("/api/v1/tasks/{$task->id}", [
        'priority' => 'high',
    ]);

    $response->assertStatus(200)
        ->assertJson([
            'data' => [
                'title' => $task->title,
                'priority' => 'high',
            ],
        ]);
});

test('exclui tarefa', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $task = Task::factory()->create(['user_id' => $user->id]);

    $response = $this->deleteJson("/api/v1/tasks/{$task->id}");

    $response->assertStatus(204);

    $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
});
