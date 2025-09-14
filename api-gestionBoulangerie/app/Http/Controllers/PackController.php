<?php

namespace App\Http\Controllers;

use App\Models\Pack;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

class PackController extends Controller
{
   /**
     * Afficher tous les packs avec leurs produits.
     */
    public function index()
    {
        $packs = Pack::with('produits')->get();
        return response()->json($packs);
    }

    /**
     * Créer un nouveau pack.
     */
  public function store(Request $request)
{
    // Valider les données
    $validatedData = $request->validate([
        'nom' => 'required|string|unique:packs,nom',
        'description' => 'nullable|string',
        'prix' => 'required|numeric|min:0',
        'photo' => 'required|file|image|max:2048',
        'produits' => 'required|array',
        'produits.*.id' => 'required|exists:produits,id',
        'produits.*.quantite' => 'required|integer|min:1',
    ]);

    // Gérer l'upload de la photo
    $photoPath = null;
    if ($request->hasFile('photo')) {
        $photoPath = $request->file('photo')->store('packs', 'public');
    }

    // Créer le pack
    $pack = Pack::create([
        'nom' => $validatedData['nom'],
        'description' => $validatedData['description'],
        'prix' => $validatedData['prix'],
        'photo' => $photoPath
    ]);

    // Préparer les données pour la table pivot
    // Laravel reçoit déjà les produits dans le bon format grâce à FormData
    $pivotData = [];
    foreach ($request->produits as $produit) {
        $pivotData[$produit['id']] = ['quantite' => $produit['quantite']];
    }

    // Attacher les produits à la table pivot
    $pack->produits()->attach($pivotData);

    return response()->json($pack->load('produits'), 201);
}
    /**
     * Afficher un pack spécifique.
     */
    public function show($id)
    {
        $pack = Pack::with('produits')->findOrFail($id);
        return response()->json($pack);
    }

    /**
     * Mettre à jour un pack existant.
     */
    public function update(Request $request, $id)
    {
        $pack = Pack::findOrFail($id);

        $request->validate([
            'nom' => 'sometimes|required|string|unique:packs,nom,' . $id,
            'description' => 'nullable|string',
            'prix' => 'sometimes|required|numeric|min:0',
            'photo' => 'nullable|file|image|max:2048',
            'produits' => 'nullable|array',
            'produits.*.id' => 'exists:produits,id',
            'produits.*.quantite' => 'integer|min:1',
        ]);

        // Upload de la nouvelle photo si présente
        if ($request->hasFile('photo')) {
            // Supprimer l’ancienne photo si existante
            if ($pack->photo && Storage::disk('public')->exists($pack->photo)) {
                Storage::disk('public')->delete($pack->photo);
            }

            $photoPath = $request->file('photo')->store('packs', 'public');
            $pack->photo = $photoPath;
        }

        $pack->update($request->only('nom', 'description', 'prix'));

        // Mettre à jour les produits si fournis
        if ($request->has('produits')) {
            $syncData = [];
            $produits = $request->produits;
            if (is_string($produits)) {
                $produits = json_decode($produits, true);
            }

            foreach ($produits as $p) {
                $syncData[$p['id']] = ['quantite' => $p['quantite'] ?? 1];
            }
            $pack->produits()->sync($syncData);
        }

        return response()->json($pack->load('produits'));
    }

    /**
     * Supprimer un pack.
     */
    public function destroy($id)
    {
        $pack = Pack::findOrFail($id);

        // Supprimer la photo du storage si existe
        if ($pack->photo && Storage::disk('public')->exists($pack->photo)) {
            Storage::disk('public')->delete($pack->photo);
        }

        $pack->produits()->detach(); // détacher les produits liés
        $pack->delete();

        return response()->json(['message' => 'Pack supprimé avec succès.']);
    }
}
