<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/*
 * Validação de criação de categoria.
 *
 * Regras:
 * - name: obrigatório, único COMBINADO com user_id (um usuário não pode ter duas categorias com o mesmo nome)
 * - color: formato hexadecimal (#RRGGBB) com 7 caracteres
 */
class StoreCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // A proteção vem do middleware auth:sanctum na rota
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                // Unique composto: o nome deve ser único dentro das categorias DESTE usuário
                Rule::unique('categories')->where('user_id', $this->user()->id),
            ],
            'color' => ['required', 'string', 'regex:/^#[a-fA-F0-9]{6}$/'],
        ];
    }
}
