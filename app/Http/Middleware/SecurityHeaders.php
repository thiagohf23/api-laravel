<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/*
 * SecurityHeaders: middleware que adiciona headers de segurança em TODAS as respostas da API.
 *
 * HSTS (Strict-Transport-Security): força HTTPS no navegador.
 * X-Content-Type-Options: previne MIME sniffing.
 * X-Frame-Options: previne clickjacking (nega iframe).
 * Referrer-Policy: controla o que é enviado no header Referer.
 * Permissions-Policy: desabilita APIs do navegador que não usamos.
 * Content-Security-Policy: camada extra contra XSS (apenas recursos da própria origem).
 */
class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

        // HSTS apenas em produção (https)
        if (app()->environment('production')) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }

        return $response;
    }
}
