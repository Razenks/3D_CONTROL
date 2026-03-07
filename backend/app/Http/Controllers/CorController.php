<?php

namespace App\Http\Controllers;

use App\Models\Cor;
use Illuminate\Http\Request;

class CorController extends Controller
{
    public function index(Request $request)
    {
        $query = Cor::orderBy('codigo');
        if ($request->has('ativos_only')) {
            $query->where('ativo', true);
        }
        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'codigo' => 'required|string|unique:cores',
            'nome' => 'required|string',
            'hex' => 'nullable|string'
        ]);
        $cor = Cor::create($request->all());
        return response()->json($cor, 201);
    }
}
