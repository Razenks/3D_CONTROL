<?php

namespace App\Http\Controllers;

use App\Models\Material;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MaterialController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Material::with(['marca', 'cor'])->orderBy('created_at', 'desc');
            
            if ($request->has('ativos_only')) {
                // Força o SQL literal 'true' para evitar que o PDO converta para o inteiro 1
                $query->whereRaw('ativo = true');
            }
            
            return response()->json($query->get());
        } catch (\Exception $e) {
            Log::error("MaterialController::index ERROR: " . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tipo' => 'required|string',
            'marca_id' => 'nullable|exists:marcas,id',
            'cor_id' => 'nullable|exists:cores,id',
            'custo_unidade' => 'required|numeric',
            'quantidade_restante' => 'required|numeric',
            'unidade' => 'required|string|in:g,ml',
        ]);
        
        // Garantir que o material nasça ativo para aparecer no frontend
        $material = Material::create(array_merge($validated, ['ativo' => DB::raw('true')]));
        
        return response()->json($material->load(['marca', 'cor']), 201);
    }

    public function update(Request $request, $id)
    {
        $material = Material::findOrFail($id);
        $material->fill($request->all());
        $material->save();
        return response()->json($material->load(['marca', 'cor']));
    }

    public function destroy($id)
    {
        $material = Material::findOrFail($id);
        $material->delete();
        return response()->json(['message' => 'Material removido com sucesso!']);
    }
}
