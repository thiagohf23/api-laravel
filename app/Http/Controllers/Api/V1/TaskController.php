<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreTaskRequest;
use App\Http\Requests\Api\V1\UpdateTaskRequest;
use App\Http\Resources\V1\TaskCollection;
use App\Http\Resources\V1\TaskResource;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/*
 * TaskController: CRUD completo de tarefas + filtros e paginação.
 *
 * Todas as queries são escopadas ao usuário autenticado
 * via $request->user()->tasks().
 */
class TaskController extends Controller
{
    /*
     * Lista tarefas com filtros opcionais e paginação.
     *
     * Filtros disponíveis (via query string):
     *   ?status=pending       → filtra por status
     *   ?priority=high        → filtra por prioridade
     *   ?category_id=1        → filtra por categoria
     *   ?search=comprar       → busca no título e descrição (mínimo 2 caracteres)
     *   ?per_page=30          → muda o tamanho da página (padrão: 15)
     */
    public function index(Request $request): TaskCollection
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'min:2'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $perPage = $validated['per_page'] ?? 15;

        $tasks = $request->user()
            ->tasks()
            ->with('category')
            ->when($request->status, fn ($q, $v) => $q->where('status', $v))
            ->when($request->priority, fn ($q, $v) => $q->where('priority', $v))
            ->when($request->category_id, fn ($q, $v) => $q->where('category_id', $v))
            ->when($validated['search'] ?? null, function ($q, $v) {
                $q->where(function ($q) use ($v) {
                    $q->where('title', 'like', "%{$v}%")
                        ->orWhere('description', 'like', "%{$v}%");
                });
            })
            ->latest()
            ->paginate($perPage);

        return new TaskCollection($tasks);
    }

    /*
     * Criar nova tarefa.
     *
     * O user_id é atribuído automaticamente do usuário autenticado.
     * category_id é opcional (nullable na migration).
     */
    public function store(StoreTaskRequest $request): TaskResource
    {
        $task = $request->user()->tasks()->create(
            $request->validated()
        );

        return TaskResource::make($task->load('category'));
    }

    /*
     * Exibir uma tarefa específica.
     */
    public function show(Request $request, Task $task): TaskResource
    {
        $task = $request->user()->tasks()->findOrFail($task->id);

        return TaskResource::make($task->load('category'));
    }

    /*
     * Atualizar tarefa.
     * Usa UpdateTaskRequest que permite PATCH parcial (sometimes nas regras).
     */
    public function update(UpdateTaskRequest $request, Task $task): TaskResource
    {
        $task = $request->user()->tasks()->findOrFail($task->id);

        $task->update($request->validated());

        return TaskResource::make($task->load('category'));
    }

    /*
     * Excluir tarefa.
     */
    public function destroy(Request $request, Task $task): JsonResponse
    {
        $task = $request->user()->tasks()->findOrFail($task->id);

        $task->delete();

        return response()->json(null, 204);
    }
}
