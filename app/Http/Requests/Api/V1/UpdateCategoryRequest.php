<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/*
 * Validação de atualização de categoria.
 *
 * Similar ao Store, mas ignora o próprio ID na verificação de unique
 * (para permitir que o usuário mantenha o mesmo nome sem conflito).
 */
class UpdateCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                // Ignora o ID da própria categoria na verificação de unique
                Rule::unique('categories')
                    ->where('user_id', $this->user()->id)
                    ->ignore($this->route('category')),
            ],
            'color' => ['sometimes', 'required', 'string', 'regex:/^#[a-fA-F0-9]{6}$/'],
        ];
    }
}
