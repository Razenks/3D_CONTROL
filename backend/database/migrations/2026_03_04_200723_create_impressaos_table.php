<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('impressoes', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->foreignId('impressora_id')->constrained('impressoras')->onDelete('cascade');
            $blueprint->foreignId('orcamento_id')->nullable()->constrained('orcamentos')->nullOnDelete();
            
            $blueprint->string('status')->default('fila'); // fila, imprimindo, concluido, falha
            $blueprint->integer('progresso')->default(0); // 0 a 100%
            $blueprint->timestamp('data_inicio')->nullable();
            $blueprint->timestamp('data_fim')->nullable();
            
            // Dados técnicos da impressão registrados no momento (para histórico)
            $blueprint->string('projeto_nome');
            $blueprint->decimal('peso_estimado', 8, 2)->nullable();
            $blueprint->string('tempo_estimado')->nullable();
            $blueprint->json('detalhes_tecnicos')->nullable(); // Gcode, Temp, etc.

            $blueprint->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('impressoes');
    }
};
