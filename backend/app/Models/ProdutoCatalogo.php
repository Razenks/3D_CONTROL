<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProdutoCatalogo extends Model
{
    use HasFactory;

    protected $table = 'produtos_catalogo';

    protected $fillable = [
        'nome',
        'peso_padrao',
        'tempo_padrao',
        'preco_venda',
        'ativo'
    ];

    protected $casts = [
        'ativo' => 'boolean',
        'peso_padrao' => 'float',
        'preco_venda' => 'float'
    ];
}
