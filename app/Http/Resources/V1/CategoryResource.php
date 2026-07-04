<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/*
 * CategoryResource: transforma o Model Category em JSON.
 *
 * Incluímos 'tasks_count' pois o controller pode usar withCount('tasks')
 * para exibir quantas tarefas cada categoria tem – útil pra UI.
 */
class CategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'color' => $this->color,
            'tasks_count' => $this->whenCounted('tasks'),
            'created_at' => $this->created_at,
        ];
    }
}
