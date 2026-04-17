<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Orcamento extends Model
{
    use HasFactory;

    protected $fillable = [
        'cliente_id',
        'cliente', // Mantido para compatibilidade legado se necessário
        'projeto',
        'itens',
        'valor_total',
        'custo_estimado',
        'lucro_estimado',
        'status',
        'metodo_pagamento',
        'detalhes_calculo',
        'motivo_rejeicao'
    ];

    protected $casts = [
        'detalhes_calculo' => 'array',
        'itens' => 'array'
    ];

    public function clienteRel()
    {
        return $this->belongsTo(Cliente::class, 'cliente_id');
    }
}
