<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

/*
 * Validação do cadastro de usuário.
 *
 * Regras:
 * - name: obrigatório, string, máximo 255 caracteres
 * - email: obrigatório, formato email, ÚNICO na tabela users (não pode repetir)
 * - password: obrigatório, mínimo 8, DEVE ser confirmado (campo password_confirmation)
 *
 * O 'confirmed' faz o Laravel automaticamente comparar password com password_confirmation.
 */
class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Qualquer um pode se cadastrar (rota pública)
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed', 'regex:/[A-Z]/', 'regex:/[a-z]/', 'regex:/[0-9]/'],
        ];
    }

    public function messages(): array
    {
        return [
            'password.regex' => 'A senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número.',
        ];
    }
}
