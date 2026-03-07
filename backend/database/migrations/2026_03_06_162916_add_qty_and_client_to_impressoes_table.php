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
        DB::statement('ALTER TABLE impressoes ADD COLUMN IF NOT EXISTS quantidade INTEGER DEFAULT 1');
        DB::statement('ALTER TABLE impressoes ADD COLUMN IF NOT EXISTS cliente_id BIGINT REFERENCES clientes(id) ON DELETE SET NULL');
    }

    public function down(): void
    {
        Schema::table('impressoes', function (Blueprint $table) {
            $table->dropColumn('quantidade');
            $table->dropColumn('cliente_id');
        });
    }
};
