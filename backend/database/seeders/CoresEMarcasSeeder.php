<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Cor;
use App\Models\Marca;

class CoresEMarcasSeeder extends Seeder
{
    public function run(): void
    {
        // Marcas Populares
        $marcas = [
            ['nome' => 'Sunlu'],
            ['nome' => 'Voolt3D'],
            ['nome' => 'Esun'],
            ['nome' => 'Creality'],
            ['nome' => 'GTMax'],
            ['nome' => '3D Prime'],
        ];

        foreach ($marcas as $marca) {
            Marca::firstOrCreate($marca);
        }

        // Cores Básicas Mapeadas por Número
        $cores = [
            ['codigo' => '1', 'nome' => 'Preto', 'hex' => '#000000'],
            ['codigo' => '2', 'nome' => 'Branco', 'hex' => '#FFFFFF'],
            ['codigo' => '3', 'nome' => 'Cinza', 'hex' => '#808080'],
            ['codigo' => '4', 'nome' => 'Vermelho', 'hex' => '#FF0000'],
            ['codigo' => '5', 'nome' => 'Azul', 'hex' => '#0000FF'],
            ['codigo' => '6', 'nome' => 'Verde', 'hex' => '#00FF00'],
            ['codigo' => '7', 'nome' => 'Amarelo', 'hex' => '#FFFF00'],
            ['codigo' => '8', 'nome' => 'Laranja', 'hex' => '#FFA500'],
            ['codigo' => '9', 'nome' => 'Rosa', 'hex' => '#FFC0CB'],
            ['codigo' => '10', 'nome' => 'Roxo', 'hex' => '#800080'],
            ['codigo' => '11', 'nome' => 'Cobre / Silk', 'hex' => '#B87333'],
            ['codigo' => '12', 'nome' => 'Ouro / Silk', 'hex' => '#FFD700'],
            ['codigo' => '13', 'nome' => 'Prata / Silk', 'hex' => '#C0C0C0'],
            ['codigo' => '14', 'nome' => 'Transparente', 'hex' => '#F0F8FF'],
        ];

        foreach ($cores as $cor) {
            Cor::firstOrCreate(['codigo' => $cor['codigo']], $cor);
        }
    }
}
