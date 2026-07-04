<?php

namespace App\Models;

use Database\Factories\CategoryFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'color'])]
class Category extends Model
{
    /** @use HasFactory<CategoryFactory> */
    use HasFactory;

    /*
     * Relacionamento: Category pertence a um User
     * Uma categoria SEMPRE tem um dono – não faz sentido existir孤立
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /*
     * Relacionamento: Category tem várias Tasks
     * Uma categoria pode ter zero ou muitas tarefas associadas
     */
    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }
}
