<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Category>
 */
class CategoryFactory extends Factory
{
    /*
     * Cria uma categoria com dados aleatórios.
     * user_id: atribuído automaticamente se não for passado na chamada.
     * name: nome realista de categoria
     * color: cor hexadecimal aleatória
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'name' => fake()->unique()->randomElement([
                'Trabalho', 'Pessoal', 'Estudos', 'Saúde', 'Projetos',
                'Compras', 'Finanças', 'Casa', 'Lazer', 'Urgente',
            ]).' '.fake()->randomElement([
                'Geral', '2026', 'Rotina', 'Semanal', 'Pendente',
            ]),
            'color' => fake()->hexColor(),
        ];
    }
}
