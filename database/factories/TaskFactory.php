<?php

namespace Database\Factories;

use App\Enum\TaskPriority;
use App\Enum\TaskStatus;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Task>
 */
class TaskFactory extends Factory
{
    /*
     * Cria uma tarefa com dados aleatórios.
     * Por padrão: status 'pending', priority 'medium'.
     * category_id não é definido aqui – a task será criada sem categoria
     * a menos que seja passado explicitamente na factory.
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(4),
            'description' => fake()->optional()->paragraph(),
            'status' => TaskStatus::Pending,
            'priority' => TaskPriority::Medium,
            'due_date' => fake()->optional()->dateTimeBetween('now', '+30 days'),
            'category_id' => null,
        ];
    }
}
