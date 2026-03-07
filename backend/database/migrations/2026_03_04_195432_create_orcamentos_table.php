<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orcamentos', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->string('cliente')->nullable();
            $blueprint->string('projeto'); // Nome do produto calculado
            $blueprint->decimal('valor_total', 10, 2);
            $blueprint->decimal('custo_estimado', 10, 2);
            $blueprint->decimal('lucro_estimado', 10, 2);
            $blueprint->string('status')->default('Aguardando Análise');
            
            // Armazena os inputs da calculadora (peso, tempo, material, etc)
            $blueprint->json('detalhes_calculo')->nullable();
            
            $blueprint->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orcamentos');
    }
};
