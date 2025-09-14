<?php

namespace App\Http\Controllers;

use App\Models\Promotion;
use Illuminate\Http\Request;

class PromotionController extends Controller
{
     public function index()
    {
        $promotions = Promotion::with('produits')->get();
        return response()->json($promotions);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type_reduction' => 'required|in:pourcentage,montant',
            'valeur_reduction' => 'required|numeric|min:0',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after_or_equal:date_debut',
            'produit_ids' => 'required|array', // plusieurs produits
            'produit_ids.*' => 'exists:produits,id',
        ]);

        // Créer la promotion
        $promotion = Promotion::create([
            'nom' => $validated['nom'],
            'description' => $validated['description'] ?? '',
            'type_reduction' => $validated['type_reduction'],
            'valeur_reduction' => $validated['valeur_reduction'],
            'date_debut' => $validated['date_debut'],
            'date_fin' => $validated['date_fin'],
        ]);

        // Attacher les produits via la table pivot
        $promotion->produits()->sync($validated['produit_ids']);

        return response()->json($promotion->load('produits'), 201);
    }

    public function show(Promotion $promotion)
    {
        return response()->json($promotion->load('produits'));
    }

    public function update(Request $request, Promotion $promotion)
    {
        $validated = $request->validate([
            'nom' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'type_reduction' => 'sometimes|required|in:pourcentage,montant',
            'valeur_reduction' => 'sometimes|required|numeric|min:0',
            'date_debut' => 'sometimes|required|date',
            'date_fin' => 'sometimes|required|date|after_or_equal:date_debut',
            'produit_ids' => 'nullable|array',
            'produit_ids.*' => 'exists:produits,id',
        ]);

        $promotion->update($validated);

        if (isset($validated['produit_ids'])) {
            $promotion->produits()->sync($validated['produit_ids']);
        }

        return response()->json($promotion->load('produits'));
    }

    public function destroy(Promotion $promotion)
    {
        $promotion->delete();
        return response()->json(null, 204);
    }
}
