<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * Aqui configuramos o rate limiting da API.
     * O Limit::perMinute(60) permite 60 requisições por minuto.
     * O ->by() segmenta o limite por usuário (se autenticado) ou IP (se anônimo).
     * Isso protege a API contra abuso e ataques de brute force.
     */
    public function boot(): void
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        /*
         * Rate limiters específicos para autenticação.
         *
         * login:    5 tentativas/minuto por IP – mitiga brute force em senhas.
         * register: 3 tentativas/minuto por IP – mitiga criação massiva de contas.
         *
         * Usamos o IP como segmentação porque o usuário ainda não está autenticado.
         */
        RateLimiter::for('login', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip());
        });

        RateLimiter::for('register', function (Request $request) {
            return Limit::perMinute(3)->by($request->ip());
        });
    }
}
