<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Material extends Model
{
    use HasFactory;

    protected $fillable = [
        'tipo',
        'marca',
        'cor',
        'marca_id',
        'cor_id',
        'hex_cor',
        'custo_unidade',
        'quantidade_restante',
        'unidade',
        'ativo'
    ];

    protected $casts = [
        'ativo' => 'boolean'
    ];

    public function marca()
    {
        return $this->belongsTo(Marca::class);
    }

    public function cor()
    {
        return $this->belongsTo(Cor::class, 'cor_id');
    }
}
