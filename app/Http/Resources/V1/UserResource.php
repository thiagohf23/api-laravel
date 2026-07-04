<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/*
 * UserResource: transforma o Model User em JSON para a API.
 *
 * NUNCA retornamos campos sensíveis como password ou remember_token.
 * Só expomos o que o frontend realmente precisa.
 */
class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'created_at' => $this->created_at,
        ];
    }
}
