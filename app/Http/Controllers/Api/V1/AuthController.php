<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\LoginRequest;
use App\Http\Requests\Api\V1\RegisterRequest;
use App\Http\Resources\V1\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

/*
 * AuthController: gerencia registro, login, logout e dados do usuário logado.
 *
 * O fluxo de autenticação é via token Sanctum:
 *   1. Usuário faz POST /register ou /login
 *   2. Servidor cria/retorna um token no formato "Bearer <token>"
 *   3. Cliente envia esse token no header "Authorization: Bearer <token>"
 *      em todas as requisições protegidas
 */
class AuthController extends Controller
{
    /*
     * Registrar novo usuário.
     *
     * Cria o usuário no banco, gera um token Sanctum e retorna
     * os dados do usuário + token em um único response.
     * Assim o cliente já sai da tela de cadastro autenticado.
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        // password NÃO está em #[Fillable] por segurança – setamos manualmente
        $data = $request->validated();
        $user = new User([
            'name' => $data['name'],
            'email' => $data['email'],
        ]);
        $user->password = $data['password'];
        $user->save();

        // Cria um token Sanctum com o nome do dispositivo (ou "api" como fallback)
        $token = $user->createToken($request->device_name ?? 'api')->plainTextToken;

        return response()->json([
            'user' => UserResource::make($user),
            'token' => $token,
        ], 201); // 201 = Created
    }

    /*
     * Login do usuário.
     *
     * Verifica se o email existe e se a senha está correta.
     * Se sim, gera um NOVO token e retorna.
     * Se não, retorna 401 Unauthorized.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Credenciais inválidas.',
            ], 401);
        }

        // Cria um novo token – o usuário pode ter múltiplos tokens (um por dispositivo)
        $token = $user->createToken($request->device_name ?? 'api')->plainTextToken;

        return response()->json([
            'user' => UserResource::make($user),
            'token' => $token,
        ]);
    }

    /*
     * Logout: revoga o token atual da requisição.
     *
     * O token é deletado do banco, invalidando aquela sessão.
     * Se o usuário estiver em outro dispositivo, os outros tokens continuam válidos.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout realizado com sucesso.',
        ]);
    }

    /*
     * Retorna os dados do usuário autenticado.
     *
     * Rota útil para o frontend verificar se o token ainda é válido
     * e carregar os dados do perfil.
     */
    public function me(Request $request): UserResource
    {
        return UserResource::make($request->user());
    }
}
