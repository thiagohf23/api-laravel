<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreCategoryRequest;
use App\Http\Requests\Api\V1\UpdateCategoryRequest;
use App\Http\Resources\V1\CategoryResource;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/*
 * CategoryController: CRUD completo de categorias.
 *
 * IMPORTANTE: Todas as queries são escopadas ao usuário autenticado.
 * Nunca usamos Category::all() ou Category::find() diretamente –
 * sempre passando pelo relacionamento $request->user()->categories().
 * Isso garante que um usuário NUNCA veja ou modifique categorias de outro.
 */
class CategoryController extends Controller
{
    /*
     * Lista todas as categorias do usuário logado.
     *
     * Inclui contagem de tarefas via withCount para exibição no frontend.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $categories = $request->user()
            ->categories()
            ->withCount('tasks')
            ->latest()
            ->get();

        return CategoryResource::collection($categories);
    }

    /*
     * Criar nova categoria.
     *
     * O user_id vem do usuário autenticado, NUNCA do request.
     */
    public function store(StoreCategoryRequest $request): CategoryResource
    {
        $category = $request->user()->categories()->create(
            $request->validated()
        );

        return CategoryResource::make($category);
    }

    public function show(Request $request, Category $category): CategoryResource
    {
        $category = $request->user()->categories()->findOrFail($category->id);

        return CategoryResource::make($category->loadCount('tasks'));
    }

    /*
     * Atualizar categoria.
     */
    public function update(UpdateCategoryRequest $request, Category $category): CategoryResource
    {
        $category = $request->user()->categories()->findOrFail($category->id);

        $category->update($request->validated());

        return CategoryResource::make($category);
    }

    /*
     * Excluir categoria.
     *
     * Retorna 204 No Content (sem corpo) – padrão REST para DELETE bem-sucedido.
     */
    public function destroy(Request $request, Category $category): JsonResponse
    {
        $category = $request->user()->categories()->findOrFail($category->id);

        $category->delete();

        return response()->json(null, 204);
    }
}
