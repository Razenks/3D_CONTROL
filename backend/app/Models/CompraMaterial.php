<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompraMaterial extends Model
{
    use HasFactory;

    protected $table = 'compras_materiais';

    protected $fillable = [
        'material_id',
        'quantidade',
        'custo_unidade',
        'valor_total',
        'fornecedor',
        'observacao'
    ];

    protected $casts = [
        'quantidade' => 'float',
        'custo_unidade' => 'float',
        'valor_total' => 'float',
    ];

    public function material()
    {
        return $this->belongsTo(Material::class);
    }
}
