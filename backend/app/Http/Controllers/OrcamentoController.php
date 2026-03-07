<?php

namespace App\Http\Controllers;

use App\Models\Orcamento;
use Illuminate\Http\Request;

class OrcamentoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Retorna todos os orçamentos, ordenados pelos mais recentes
        $orcamentos = Orcamento::orderBy('created_at', 'desc')->get();
        return response()->json($orcamentos);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'cliente' => 'nullable|string|max:255',
            'projeto' => 'required|string|max:255',
            'valor_total' => 'required|numeric|min:0',
            'custo_estimado' => 'required|numeric|min:0',
            'lucro_estimado' => 'required|numeric|min:0',
            'status' => 'sometimes|string',
            'detalhes_calculo' => 'nullable|array'
        ]);

        $orcamento = Orcamento::create($validatedData);

        return response()->json([
            'message' => 'Orçamento gerado com sucesso!',
            'orcamento' => $orcamento
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $orcamento = Orcamento::findOrFail($id);
        return response()->json($orcamento);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $orcamento = Orcamento::findOrFail($id);
        
        $validatedData = $request->validate([
            'status' => 'required|string',
            'valor_total' => 'sometimes|numeric|min:0',
            'motivo_rejeicao' => 'nullable|string'
        ]);

        $orcamento->update($validatedData);

        return response()->json([
            'message' => 'Orçamento atualizado!',
            'orcamento' => $orcamento
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $orcamento = Orcamento::findOrFail($id);
        $orcamento->delete();

        return response()->json([
            'message' => 'Orçamento removido com sucesso!'
        ]);
    }
}
