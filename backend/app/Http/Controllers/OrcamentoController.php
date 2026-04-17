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
        $orcamentos = Orcamento::with('clienteRel')->orderBy('created_at', 'desc')->get();
        return response()->json($orcamentos);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'cliente_id' => 'nullable|exists:clientes,id',
            'cliente' => 'nullable|string|max:255',
            'projeto' => 'required|string|max:255',
            'itens' => 'nullable|array',
            'valor_total' => 'required|numeric|min:0',
            'custo_estimado' => 'required|numeric|min:0',
            'lucro_estimado' => 'required|numeric|min:0',
            'status' => 'sometimes|string',
            'metodo_pagamento' => 'nullable|string',
            'detalhes_calculo' => 'nullable|array'
        ]);

        // Se houver cliente_id mas não houver nome de cliente, preencher com o nome do cliente do banco
        if (!empty($validatedData['cliente_id']) && empty($validatedData['cliente'])) {
            $cliente = \App\Models\Cliente::find($validatedData['cliente_id']);
            if ($cliente) {
                $validatedData['cliente'] = $cliente->nome;
            }
        }

        $orcamento = Orcamento::create($validatedData);

        return response()->json([
            'message' => 'Orçamento gerado com sucesso!',
            'orcamento' => $orcamento->load('clienteRel')
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $orcamento = Orcamento::with('clienteRel')->findOrFail($id);
        return response()->json($orcamento);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $orcamento = Orcamento::findOrFail($id);
        
        $validatedData = $request->validate([
            'cliente_id' => 'nullable|exists:clientes,id',
            'cliente' => 'nullable|string|max:255',
            'projeto' => 'sometimes|required|string|max:255',
            'itens' => 'nullable|array',
            'valor_total' => 'sometimes|required|numeric|min:0',
            'custo_estimado' => 'sometimes|required|numeric|min:0',
            'lucro_estimado' => 'sometimes|required|numeric|min:0',
            'status' => 'sometimes|string',
            'metodo_pagamento' => 'nullable|string',
            'detalhes_calculo' => 'nullable|array',
            'motivo_rejeicao' => 'nullable|string'
        ]);

        // Se houver cliente_id mas não houver nome de cliente, preencher com o nome do cliente do banco
        if (isset($validatedData['cliente_id']) && empty($validatedData['cliente'])) {
            $cliente = \App\Models\Cliente::find($validatedData['cliente_id']);
            if ($cliente) {
                $validatedData['cliente'] = $cliente->nome;
            }
        }

        $orcamento->update($validatedData);

        return response()->json([
            'message' => 'Orçamento atualizado com sucesso!',
            'orcamento' => $orcamento->load('clienteRel')
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
