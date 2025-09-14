<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use Illuminate\Http\Request;

class ProduitController extends Controller
{

public function index()
{
    $produits = Produit::with(['categorie', 'promotions'])->get();
    return response()->json($produits);
}

public function show($id)
{
    $produit = Produit::with(['categorie', 'promotions'])->findOrFail($id);
    return response()->json($produit);
}

public function store(Request $request)
{
    $validated = $request->validate([
        'categorie_id' => 'required|exists:categories,id',
        'nom' => 'required|string|max:255',

        'description' => 'nullable|string',
        'prix' => 'required|numeric|min:0',
        'stock' => 'required|integer|min:0',
        'photo' => 'required|file|image|max:2048',
        'allergenes' => 'nullable|array',
        'allergenes.*' => 'string|max:255'
    ]);

    // Gérer l'image
    if ($request->hasFile('photo')) {
        $path = $request->file('photo')->store('produits', 'public');
        $validated['photo'] = $path;
    }

    $produit = Produit::create($validated);

    return response()->json($produit, 201);
}

public function update(Request $request, Produit $produit)
{
    $validated = $request->validate([
        'categorie_id' => 'required|exists:categories,id',
        'nom' => 'required|string|max:255',
        'description' => 'nullable|string',
        'prix' => 'required|numeric|min:0',
        'stock' => 'required|integer|min:0',
        'photo' => 'nullable|file|image|max:2048',
        'allergenes' => 'nullable|array',
        'allergenes.*' => 'string|max:255'
    ]);

    if ($request->hasFile('photo')) {
        $path = $request->file('photo')->store('produits', 'public');
        $validated['photo'] = $path;
    }

    $produit->update($validated);

    return response()->json($produit);
}

public function updateStock(Request $request, Produit $produit)
{
    $validated = $request->validate([
        'stock' => 'required|integer' // peut être positif ou négatif
    ]);

    // Ajouter ou soustraire la quantité
    $produit->stock += $validated['stock'];

    // S'assurer que le stock ne devient pas négatif
    if ($produit->stock < 0) {
        $produit->stock = 0;
    }

    $produit->save();

    return response()->json($produit);
}




   // Supprime un produit
public function destroy($id)
{
    $produit = Produit::findOrFail($id);

    try {
        $produit->delete();
        return response()->json(['message' => 'Produit supprimé avec succès'], 200);
    } catch (\Illuminate\Database\QueryException $e) {
        // Vérifie si c'est une violation de clé étrangère
        if ($e->getCode() === '23503') { // PostgreSQL foreign key violation
            return response()->json([
                'message' => 'Impossible de supprimer ce produit : il est utilisé ailleurs.'
            ], 400);
        }
        // Pour toute autre erreur
        return response()->json([
            'message' => 'Erreur lors de la suppression du produit.',
            'error' => $e->getMessage()
        ], 500);
    }
}



    }

