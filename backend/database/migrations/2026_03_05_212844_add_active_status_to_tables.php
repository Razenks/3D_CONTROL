<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('clientes', function (Blueprint $table) {
            $table->boolean('ativo')->default(true)->after('endereco_entrega');
        });

        Schema::table('materials', function (Blueprint $table) {
            $table->boolean('ativo')->default(true)->after('unidade');
        });

        Schema::table('produtos', function (Blueprint $table) {
            $table->boolean('ativo')->default(true)->after('quantidade');
        });
    }

    public function down(): void
    {
        Schema::table('clientes', function (Blueprint $table) { $table->dropColumn('ativo'); });
        Schema::table('materials', function (Blueprint $table) { $table->dropColumn('ativo'); });
        Schema::table('produtos', function (Blueprint $table) { $table->dropColumn('ativo'); });
    }
};
