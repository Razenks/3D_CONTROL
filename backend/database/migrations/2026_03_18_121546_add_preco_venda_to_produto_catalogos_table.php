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
        Schema::table('produtos_catalogo', function (Blueprint $col) {
            $col->decimal('preco_venda', 10, 2)->nullable()->after('tempo_padrao');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('produtos_catalogo', function (Blueprint $col) {
            $col->dropColumn('preco_venda');
        });
    }
};
