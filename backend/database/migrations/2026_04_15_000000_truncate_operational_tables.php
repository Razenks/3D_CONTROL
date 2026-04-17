<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::disableForeignKeyConstraints();

        DB::table('impressoes')->truncate();
        DB::table('orcamentos')->truncate();
        DB::table('produtos')->truncate();
        DB::table('materials')->truncate();

        Schema::enableForeignKeyConstraints();
    }

    public function down(): void
    {
        // Não é possível reverter um truncate - os dados são perdidos permanentemente
    }
};
