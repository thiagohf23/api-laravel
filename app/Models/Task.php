<?php

namespace App\Models;

use App\Enum\TaskPriority;
use App\Enum\TaskStatus;
use Database\Factories\TaskFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['title', 'description', 'status', 'priority', 'due_date', 'category_id'])]
class Task extends Model
{
    /** @use HasFactory<TaskFactory> */
    use HasFactory;

    /*
     * Castings automáticos:
     * - status e priority: convertidos para os Enums PHP (valores tipados e seguros)
     * - due_date: convertido para objeto Carbon (facilita formatação e cálculos com datas)
     */
    protected function casts(): array
    {
        return [
            'status' => TaskStatus::class,
            'priority' => TaskPriority::class,
            'due_date' => 'date',
        ];
    }

    /*
     * Relacionamento: Task pertence a um User
     * Toda task tem um dono – usado para escopo de segurança
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /*
     * Relacionamento: Task pertence a uma Category (opcional)
     * category_id pode ser null – a task existe independentemente
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /*
     * Escopo local: filtra tasks por status
     * Uso: Task::whereStatus(TaskStatus::Pending)->get()
     */
    public function scopeWhereStatus($query, TaskStatus $status): Builder
    {
        return $query->where('status', $status->value);
    }
}
