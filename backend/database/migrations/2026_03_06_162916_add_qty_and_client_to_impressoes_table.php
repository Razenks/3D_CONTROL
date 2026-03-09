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
        Schema::table('impressoes', function (Blueprint $table) {
            if (!Schema::hasColumn('impressoes', 'quantidade')) {
                $table->integer('quantidade')->default(1);
            }
            if (!Schema::hasColumn('impressoes', 'cliente_id')) {
                $table->foreignId('cliente_id')
                    ->nullable()
                    ->constrained('clientes')
                    ->onDelete('set null');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('impressoes', function (Blueprint $table) {
            if (Schema::hasColumn('impressoes', 'cliente_id')) {
                $table->dropForeign(['cliente_id']);
                $table->dropColumn('cliente_id');
            }
            if (Schema::hasColumn('impressoes', 'quantidade')) {
                $table->dropColumn('quantidade');
            }
        });
    }
};
