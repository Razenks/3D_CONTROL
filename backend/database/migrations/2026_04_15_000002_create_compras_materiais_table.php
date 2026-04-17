<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('compras_materiais', function (Blueprint $table) {
            $table->id();
            $table->foreignId('material_id')->constrained('materials')->onDelete('cascade');
            $table->decimal('quantidade', 10, 2);
            $table->decimal('custo_unidade', 10, 2); // custo por kg/litro nesta compra
            $table->decimal('valor_total', 10, 2);
            $table->string('fornecedor')->nullable();
            $table->text('observacao')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('compras_materiais');
    }
};
