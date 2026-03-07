<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;

class ClienteController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Cliente::orderBy('nome');
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
            'nome' => 'required|string|max:255',
            'tipo' => 'sometimes|string|in:CPF,CNPJ',
            'cpf' => 'nullable|string|unique:clientes',
            'cnpj' => 'nullable|string|unique:clientes',
            'email' => 'nullable|email',
            'telefone' => 'nullable|string',
            'endereco' => 'nullable|string',
            'endereco_entrega' => 'nullable|string'
        ]);

        $cliente = Cliente::create($validated);
        return response()->json($cliente, 201);
    }

    public function show($id)
    {
        return response()->json(Cliente::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $cliente = Cliente::findOrFail($id);
        $cliente->fill($request->all());
        $cliente->save();
        return response()->json($cliente);
    }

    public function destroy($id)
    {
        $cliente = Cliente::findOrFail($id);
        $cliente->delete();
        return response()->json(['message' => 'Cliente removido com sucesso!']);
    }
}
