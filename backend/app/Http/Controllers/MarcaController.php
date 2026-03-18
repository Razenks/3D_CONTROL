<?php

namespace App\Http\Controllers;

use App\Models\Marca;
use Illuminate\Http\Request;

class MarcaController extends Controller
{
    public function index(Request $request)
    {
        $query = Marca::orderBy('nome');
        if ($request->has('ativos_only')) {
            $query->where('ativo', true);
        }
        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $request->validate(['nome' => 'required|string|unique:marcas']);
        $marca = Marca::create($request->all());
        return response()->json($marca, 201);
    }

    public function update(Request $request, $id)
    {
        $marca = Marca::findOrFail($id);
        $request->validate(['nome' => 'required|string|unique:marcas,nome,' . $id]);
        $marca->update($request->all());
        return response()->json($marca);
    }
}
