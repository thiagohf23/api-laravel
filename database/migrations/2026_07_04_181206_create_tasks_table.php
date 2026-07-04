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
         * Tabela principal de tarefas.
         *
         * Status segue o fluxo: pending → in_progress → completed
         * Prioridade indica urgência: low, medium, high
         * category_id é opcional (nullable) – a tarefa pode existir sem categoria
         */
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();

            $table->string('title');                // Título curto da tarefa
            $table->text('description')->nullable(); // Descrição opcional (detalhes)
            $table->string('status')->default('pending');  // pending | in_progress | completed
            $table->string('priority')->default('medium'); // low | medium | high
            $table->date('due_date')->nullable();   // Data de vencimento opcional

            // FK para o usuário dono da tarefa
            $table->foreignId('user_id')
                ->constrained()
                ->onDelete('cascade');

            // FK opcional para categoria – se a categoria for excluída,
            // a tarefa continua (SET NULL) em vez de ser deletada
            $table->foreignId('category_id')
                ->nullable()
                ->constrained()
                ->onDelete('set null');

            // Índices para performance (SQLite não cria índices automáticos em FKs)
            $table->index('user_id');
            $table->index('category_id');
            $table->index('status');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
