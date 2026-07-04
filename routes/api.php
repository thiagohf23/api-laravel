<?php

/*
 * Arquivo de rotas da API (Laravel 13)
 *
 * O prefixo /api é adicionado automaticamente pelo bootstrap/app.php.
 * Nós adicionamos manualmente o prefixo /v1 para versionamento.
 *
 * Estrutura:
 *   /api/v1/register  → pública (cria conta)
 *   /api/v1/login     → pública (autentica)
 *   Demais rotas      → protegidas por auth:sanctum (token necessário)
 */

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\TaskController;
use Illuminate\Support\Facades\Route;

// ─── Rotas Públicas (não exigem token) ───────────────────────────────────────
Route::prefix('v1')->group(function (): void {

    // AuthController lida com registro e login
    // Rate limiting: 3 tentativas/min no register, 5 tentativas/min no login
    // Protege contra criação massiva de contas e brute force de senhas
    Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:register');
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:login');

    // ─── Rotas Protegidas (exigem token Sanctum) ───────────────────────────
    // O middleware auth:sanctum verifica o header Authorization: Bearer <token>
    Route::middleware('auth:sanctum')->group(function (): void {

        // Dados do usuário logado + logout
        Route::get('/user', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);

        // CRUD de Categorias
        // Route::apiResource NÃO cria rotas create/edit (desnecessárias em APIs)
        Route::apiResource('/categories', CategoryController::class);

        // CRUD de Tarefas
        Route::apiResource('/tasks', TaskController::class);
    });
});
