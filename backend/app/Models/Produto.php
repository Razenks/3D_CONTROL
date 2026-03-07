<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produto extends Model
{
    use HasFactory;

    protected $fillable = [
        'nome',
        'quantidade',
        'data_fabricacao',
        'custo_material',
        'tempo_horas',
        'margem_lucro',
        'ativo',
        'material_id',
        'material_nome',
        'material_cor',
        'material_hex_cor'
    ];

    protected $casts = [
        'ativo' => 'boolean'
    ];
}
