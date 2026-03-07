<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cores', function (Blueprint $table) {
            $table->id();
            $table->string('codigo')->unique(); // Ex: 1
            $table->string('nome'); // Ex: Preto
            $table->string('hex')->nullable(); // Ex: #000000
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cores');
    }
};
