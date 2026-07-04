<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        /*
         * Tabela de categorias.
         *
         * Cada categoria pertence a um usuário (foreign key user_id).
         * O onDelete('cascade') garante que, se o usuário for excluído,
         * todas as categorias dele são removidas automaticamente.
         */
        Schema::create('categories', function (Blueprint $table) {
            $table->id();

            $table->string('name');       // Nome da categoria (ex: "Trabalho", "Pessoal")
            $table->string('color', 7);   // Cor em hexadecimal (ex: #FF5733)

            // FK para o usuário dono da categoria
            $table->foreignId('user_id')
                ->constrained()
                ->onDelete('cascade');

            $table->timestamps();

            // Índices para performance (SQLite não cria índices automáticos em FKs)
            $table->index('user_id');

            // Garante que um usuário não tenha duas categorias com o mesmo nome
            $table->unique(['user_id', 'name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
