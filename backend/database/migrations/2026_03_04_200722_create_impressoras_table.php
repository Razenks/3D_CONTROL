<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('impressoras', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->string('nome');
            $blueprint->string('modelo'); // K1, Ender 3, etc.
            $blueprint->string('ip_local')->nullable(); // Ex: 192.168.1.50
            $blueprint->string('tipo_conexao')->default('manual'); // manual, klipper, octoprint
            $blueprint->string('status_atual')->default('offline'); // online, offline, imprimindo
            $blueprint->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('impressoras');
    }
};
