<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

/*
 * TaskCollection: delega a paginação para o padrão do Laravel.
 *
 * O Laravel já adiciona automaticamente os metadados de paginação
 * (current_page, total, per_page, etc.) via PaginatedResourceResponse.
 * Não precisamos duplicar isso no toArray.
 */
class TaskCollection extends ResourceCollection
{
    public $collects = TaskResource::class;

    public function toArray(Request $request): array
    {
        return [
            'data' => $this->collection,
        ];
    }
}
