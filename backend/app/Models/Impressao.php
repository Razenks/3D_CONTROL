<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Impressao extends Model
{
    use HasFactory;

    protected $table = 'impressoes';

    protected $fillable = [
        'impressora_id',
        'orcamento_id',
        'material_id',
        'cliente_id',
        'gcode_filename',
        'status',
        'progresso',
        'quantidade',
        'quantidade_concluida',
        'data_inicio',
        'data_fim',
        'projeto_nome',
        'preco_venda',
        'peso_estimado',
        'tempo_estimado',
        'detalhes_tecnicos'
    ];

    protected $casts = [
        'detalhes_tecnicos' => 'array',
        'data_inicio' => 'datetime',
        'data_fim' => 'datetime',
        'peso_estimado' => 'float',
        'preco_venda' => 'float',
        'progresso' => 'integer',
        'quantidade' => 'integer'
    ];

    public function impressora()
    {
        return $this->belongsTo(Impressora::class);
    }

    public function orcamento()
    {
        return $this->belongsTo(Orcamento::class);
    }

    public function material()
    {
        return $this->belongsTo(Material::class);
    }

    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }
}
