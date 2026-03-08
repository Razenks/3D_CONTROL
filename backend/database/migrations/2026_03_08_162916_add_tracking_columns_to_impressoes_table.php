<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('impressoes', function (Blueprint $table) {
            // Se a coluna 'quantidade' já existe de migrações anteriores, renomeamos ou mantemos.
            // Para garantir compatibilidade com o que já foi criado:
            if (!Schema::hasColumn('impressoes', 'gcode_filename')) {
                $table->string('gcode_filename')->nullable()->after('projeto_nome');
            }
            
            // Caso queira renomear a coluna 'quantidade' para 'quantidade_total' 
            // Mas para evitar erros se já estiver rodando, vamos apenas garantir que os nomes batam no Model.
        });
    }

    public function down(): void
    {
        Schema::table('impressoes', function (Blueprint $table) {
            $table->dropColumn('gcode_filename');
        });
    }
};
