<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

// HasApiTokens: trait do Sanctum que permite ao User gerar e gerenciar tokens de API
// Cada token é armazenado na tabela 'personal_access_tokens' e enviado via header Authorization: Bearer
#[Fillable(['name', 'email'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /*
     * Relacionamento: um User tem várias Categorias
     * Uma categoria pertence exclusivamente a um usuário (proteção multi-tenancy)
     */
    public function categories(): HasMany
    {
        return $this->hasMany(Category::class);
    }

    /*
     * Relacionamento: um User tem várias Tasks
     * Escopo automático: $user->tasks() já retorna SÓ as tasks do usuário logado
     */
    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
