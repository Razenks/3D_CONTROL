<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public $withinTransaction = false;

    public function up(): void
    {
        DB::statement('CREATE TABLE IF NOT EXISTS produtos_catalogo (
            id SERIAL PRIMARY KEY,
            nome VARCHAR(255) NOT NULL,
            peso_padrao DECIMAL(8,2) NOT NULL,
            tempo_padrao VARCHAR(255) NOT NULL,
            ativo BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP NULL,
            updated_at TIMESTAMP NULL
        )');
    }

    public function down(): void
    {
        Schema::dropIfExists('produtos_catalogo');
    }
};
