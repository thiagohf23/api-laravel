<?php

namespace Database\Seeders;

use App\Enum\TaskPriority;
use App\Enum\TaskStatus;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $user = User::factory()->create([
            'name' => 'Usuário Teste',
            'email' => 'test@example.com',
        ]);

        // Cria 5 categorias e 15 tarefas para o usuário teste
        $categories = $user->categories()->createMany([
            ['name' => 'Trabalho', 'color' => '#ef4444'],
            ['name' => 'Pessoal', 'color' => '#3b82f6'],
            ['name' => 'Estudos', 'color' => '#10b981'],
            ['name' => 'Projetos', 'color' => '#f59e0b'],
            ['name' => 'Saúde', 'color' => '#8b5cf6'],
        ]);

        $statuses = [TaskStatus::Pending, TaskStatus::InProgress, TaskStatus::Completed];
        $priorities = [TaskPriority::Low, TaskPriority::Medium, TaskPriority::High];

        foreach (range(1, 15) as $i) {
            $user->tasks()->create([
                'title' => fake()->sentence(4),
                'description' => fake()->optional(0.7)->paragraph(),
                'status' => $statuses[array_rand($statuses)],
                'priority' => $priorities[array_rand($priorities)],
                'due_date' => fake()->optional(0.5)->dateTimeBetween('now', '+30 days'),
                'category_id' => fake()->optional(0.6)->randomElement($categories->pluck('id')->toArray()),
            ]);
        }
    }
}
