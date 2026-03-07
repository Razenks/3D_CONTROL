<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    // Desabilitar transação para ver o erro real de cada comando
    public $withinTransaction = false;

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Usando DB::statement para evitar problemas de tradução de tipos no Postgres
        DB::statement('ALTER TABLE impressoras ADD COLUMN IF NOT EXISTS ativo BOOLEAN DEFAULT TRUE');
        DB::statement('ALTER TABLE marcas ADD COLUMN IF NOT EXISTS ativo BOOLEAN DEFAULT TRUE');
        DB::statement('ALTER TABLE cores ADD COLUMN IF NOT EXISTS ativo BOOLEAN DEFAULT TRUE');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('impressoras', function (Blueprint $table) { $table->dropColumn('ativo'); });
        Schema::table('marcas', function (Blueprint $table) { $table->dropColumn('ativo'); });
        Schema::table('cores', function (Blueprint $table) { $table->dropColumn('ativo'); });
    }
};
