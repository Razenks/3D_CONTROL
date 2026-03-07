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
        Schema::create('materials', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->string('tipo'); // PLA, PETG, etc.
            $blueprint->string('marca');
            $blueprint->string('cor');
            $blueprint->string('hex_cor')->nullable();
            $blueprint->decimal('custo_unidade', 10, 2); // Preço por KG ou Litro
            $blueprint->decimal('quantidade_restante', 10, 2); // Gramas ou ML
            $blueprint->string('unidade')->default('g'); // g ou ml
            $blueprint->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('materials');
    }
};
