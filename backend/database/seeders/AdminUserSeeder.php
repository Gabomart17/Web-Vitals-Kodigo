<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@ecommerce.test'],
            [
                'name' => 'Administrador',
                'password' => Hash::make('admin12345'),
                'role' => 'admin',
                'phone' => '+503 7000-0000',
                'address' => 'San Salvador, El Salvador',
            ]
        );

        User::updateOrCreate(
            ['email' => 'cliente@ecommerce.test'],
            [
                'name' => 'Cliente de Prueba',
                'password' => Hash::make('cliente12345'),
                'role' => 'customer',
                'phone' => '+503 7000-1111',
                'address' => 'Santa Tecla, El Salvador',
            ]
        );
    }
}
