<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    use HasFactory;

    protected $fillable = [
        'nome',
        'tipo',
        'cpf',
        'cnpj',
        'email',
        'telefone',
        'endereco',
        'endereco_entrega',
        'ativo'
    ];

    protected $casts = [
        'ativo' => 'boolean'
    ];

    public function orcamentos()
    {
        return $this->hasMany(Orcamento::class);
    }
}
