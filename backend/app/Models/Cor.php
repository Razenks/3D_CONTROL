<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cor extends Model
{
    use HasFactory;
    protected $table = 'cores';
    protected $fillable = ['codigo', 'nome', 'hex', 'ativo'];
    protected $casts = ['ativo' => 'boolean'];

    public function materiais()
    {
        return $this->hasMany(Material::class);
    }
}
