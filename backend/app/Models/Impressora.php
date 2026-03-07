<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Impressora extends Model
{
    use HasFactory;

    protected $fillable = [
        'nome',
        'modelo',
        'ip_local',
        'tipo_conexao',
        'status_atual',
        'ativo'
    ];

    protected $casts = [
        'ativo' => 'boolean'
    ];

    public function impressoes()
    {
        return $this->hasMany(Impressao::class);
    }
}
