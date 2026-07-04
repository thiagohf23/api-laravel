<?php

namespace App\Enum;

/*
 * Enum de prioridade da Task:
 *   low    → tarefa de baixa urgência
 *   medium → padrão, a maioria das tarefas
 *   high   → urgente, deve ser feita o quanto antes
 */
enum TaskPriority: string
{
    case Low = 'low';
    case Medium = 'medium';
    case High = 'high';
}
