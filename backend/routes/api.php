<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MaterialController;
use App\Http\Controllers\ProdutoController;
use App\Http\Controllers\OrcamentoController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ImpressoraController;
use App\Http\Controllers\ImpressaoController;
use App\Http\Controllers\RelatorioController;
use App\Http\Controllers\MarcaController;
use App\Http\Controllers\CorController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\ProdutoCatalogoController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes (require a valid token)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Home / Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Relatórios
    Route::get('/relatorios', [RelatorioController::class, 'index']);

    // Marcas e Cores
    Route::get('/marcas', [MarcaController::class, 'index']);
    Route::post('/marcas', [MarcaController::class, 'store']);
    Route::put('/marcas/{id}', [MarcaController::class, 'update']);
    Route::get('/cores', [CorController::class, 'index']);
    Route::post('/cores', [CorController::class, 'store']);
    Route::put('/cores/{id}', [CorController::class, 'update']);

    // Clientes
    Route::apiResource('clientes', ClienteController::class);

    // Materiais (CRUD)
    Route::apiResource('materiais', MaterialController::class);

    // Catálogo de Produtos (Modelos)
    Route::apiResource('produtos-catalogo', ProdutoCatalogoController::class);

    // Produtos (CRUD + Stock Update)
    Route::apiResource('produtos', ProdutoController::class);
    Route::patch('produtos/{id}/stock', [ProdutoController::class, 'updateStock']);

    // Orçamentos (CRUD)
    Route::apiResource('orcamentos', OrcamentoController::class);
    Route::patch('orcamentos/{id}', [OrcamentoController::class, 'update']);

    // Impressoras e Impressões
    Route::get('impressoes/available-orcamentos', [ImpressaoController::class, 'getAvailableOrcamentos']);
    Route::get('impressoras/{id}/status', [ImpressoraController::class, 'checkStatus']);
    Route::get('impressoras/{id}/current-print', [ImpressoraController::class, 'getCurrentPrint']);
    Route::get('impressoras/{id}/files', [ImpressoraController::class, 'getFiles']);
    Route::get('impressoras/{id}/proxy-image', [ImpressoraController::class, 'proxyImage']);
    Route::post('impressoras/{id}/start-print', [ImpressoraController::class, 'startPrint']);
    Route::apiResource('impressoras', ImpressoraController::class);
    Route::apiResource('impressoes', ImpressaoController::class);
    Route::patch('impressoes/{id}', [ImpressaoController::class, 'update']);
});
