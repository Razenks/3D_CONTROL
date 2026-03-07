<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Criar os 3 usuários administradores usando o nome como login
        User::create([
            'name' => 'Rafhael',
            'email' => 'Rafhael', 
            'password' => Hash::make('Rafha@123rbprintings3d'),
        ]);

        User::create([
            'name' => 'Tony',
            'email' => 'Tony',
            'password' => Hash::make('Tony@123rbprintings3d'),
        ]);

        User::create([
            'name' => 'Bruno',
            'email' => 'Bruno',
            'password' => Hash::make('Bruno@123rbprintings3d'),
        ]);

        // Chamar o seeder de Cores e Marcas
        $this->call([
            CoresEMarcasSeeder::class,
        ]);
    }
}
