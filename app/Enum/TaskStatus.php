<?php

namespace App\Enum;

/*
 * Enum de status da Task – representa o fluxo de um quadro Kanban:
 *   pending      → tarefa criada, ainda não iniciada
 *   in_progress  → tarefa em andamento
 *   completed    → tarefa finalizada
 *
 * Usar enum (não string solta) evita valores inválidos no banco e
 * dá auto-completion na IDE.
 */
enum TaskStatus: string
{
    case Pending = 'pending';
    case InProgress = 'in_progress';
    case Completed = 'completed';
}
