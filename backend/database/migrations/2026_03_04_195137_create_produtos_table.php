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
        Schema::create('produtos', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->string('nome');
            $blueprint->decimal('tempo_horas', 8, 2);
            $blueprint->date('data_fabricacao');
            $blueprint->decimal('custo_material', 10, 2);
            $blueprint->integer('margem_lucro'); // Em percentual (ex: 300)
            $blueprint->integer('quantidade')->default(1);
            
            // Relacionamento opcional com o Insumo
            $blueprint->foreignId('material_id')->nullable()->constrained('materials')->nullOnDelete();
            
            // Caso o material seja removido ou não informado, mantemos os dados básicos para exibição
            $blueprint->string('material_nome')->nullable(); 
            $blueprint->string('material_cor')->nullable();
            $blueprint->string('material_hex_cor')->nullable();
            
            $blueprint->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produtos');
    }
};
