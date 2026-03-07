<?php

namespace App\Http\Controllers;

use App\Models\Produto;
use Illuminate\Http\Request;

class ProdutoController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Produto::orderBy('nome');
            if ($request->has('ativos_only')) {
                $query->whereRaw('ativo = true');
            }
            return response()->json($query->get());
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string',
            'quantidade' => 'required|integer',
            'data_fabricacao' => 'required|date',
            'custo_material' => 'required|numeric',
            'tempo_horas' => 'required|numeric',
            'margem_lucro' => 'required|numeric',
        ]);
        $produto = Produto::create($validated);
        return response()->json($produto, 201);
    }

    public function update(Request $request, $id)
    {
        $produto = Produto::findOrFail($id);
        $produto->fill($request->all());
        $produto->save();
        return response()->json($produto);
    }

    public function updateStock(Request $request, $id)
    {
        $produto = Produto::findOrFail($id);
        $action = $request->input('action');
        $quantity = $request->input('quantity', 1);
        if ($action === 'add') { $produto->increment('quantidade', $quantity); } 
        else { $produto->decrement('quantidade', $quantity); }
        return response()->json($produto);
    }

    public function destroy($id)
    {
        $produto = Produto::findOrFail($id);
        $produto->delete();
        return response()->json(['message' => 'Produto removido com sucesso!']);
    }
}
