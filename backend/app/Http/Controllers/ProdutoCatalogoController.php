<?php

namespace App\Http\Controllers;

use App\Models\ProdutoCatalogo;
use Illuminate\Http\Request;

class ProdutoCatalogoController extends Controller
{
    public function index()
    {
        return response()->json(ProdutoCatalogo::orderBy('nome')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string',
            'peso_padrao' => 'required|numeric|min:0',
            'tempo_padrao' => 'required|string',
            'preco_venda' => 'nullable|numeric|min:0'
        ]);

        $produto = ProdutoCatalogo::create($validated);
        return response()->json($produto, 201);
    }

    public function show($id)
    {
        return response()->json(ProdutoCatalogo::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $produto = ProdutoCatalogo::findOrFail($id);
        $produto->update($request->all());
        return response()->json($produto);
    }

    public function destroy($id)
    {
        $produto = ProdutoCatalogo::findOrFail($id);
        $produto->delete();
        return response()->json(['message' => 'Removido com sucesso']);
    }
}
