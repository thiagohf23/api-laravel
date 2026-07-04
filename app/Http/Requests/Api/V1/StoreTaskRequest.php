<?php

namespace App\Http\Requests\Api\V1;

use App\Enum\TaskPriority;
use App\Enum\TaskStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/*
 * Validação de criação de tarefa.
 *
 * Regras:
 * - title: obrigatório
 * - status: deve ser um dos valores do enum TaskStatus (pending, in_progress, completed)
 * - priority: deve ser um dos valores do enum TaskPriority (low, medium, high)
 * - category_id: opcional, deve existir na tabela categories E pertencer ao usuário logado
 */
class StoreTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['sometimes', Rule::enum(TaskStatus::class)],
            'priority' => ['sometimes', Rule::enum(TaskPriority::class)],
            'due_date' => ['nullable', 'date', 'after_or_equal:today'],
            'category_id' => [
                'nullable',
                'integer',
                // Só permite categorias que existam E pertençam a este usuário
                Rule::exists('categories', 'id')->where('user_id', $this->user()->id),
            ],
        ];
    }
}
