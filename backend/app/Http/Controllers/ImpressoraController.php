<?php

namespace App\Http\Controllers;

use App\Models\Impressora;
use Illuminate\Http\Request;

class ImpressoraController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Impressora::orderBy('nome');
        if ($request->has('ativos_only')) {
            $query->where('ativo', true);
        }
        return response()->json($query->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string',
            'modelo' => 'required|string',
            'ip_local' => 'nullable|string',
            'tipo_conexao' => 'required|string|in:manual,klipper,octoprint',
        ]);

        $impressora = Impressora::create($validated);

        return response()->json($impressora, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return response()->json(Impressora::findOrFail($id));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $impressora = Impressora::findOrFail($id);
        
        $validated = $request->validate([
            'nome' => 'sometimes|string',
            'modelo' => 'sometimes|string',
            'ip_local' => 'nullable|string',
            'tipo_conexao' => 'sometimes|string|in:manual,klipper,octoprint',
            'status_atual' => 'sometimes|string',
        ]);

        $impressora->update($validated);

        return response()->json($impressora);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $impressora = Impressora::findOrFail($id);
        $impressora->delete();

        return response()->json(['message' => 'Impressora removida com sucesso!']);
    }
}
