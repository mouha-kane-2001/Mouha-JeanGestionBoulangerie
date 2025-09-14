<?php

namespace App\Http\Controllers;

use App\Models\Commande;
use App\Models\DetailCommande;

use App\Models\Facture;
use App\Models\Pack;
use App\Models\Panier;
use App\Models\PanierItem;
use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Str;


class PanierController extends Controller
{
   public function get(Request $request)
{
    $userId = $request->user()->id;
    $panier = Panier::where('user_id', $userId)->first();

    if (!$panier) {
        return response()->json(['id' => 0, 'user_id' => $userId, 'items' => []]);
    }

    // Charger les items avec leurs relations
    $items = $panier->items()->with(['produit', 'pack'])->get()->map(function ($item) {
        return [
            'id' => $item->id,
            'produit' => $item->produit,
            'pack' => $item->pack,
            'quantite' => $item->quantite,
            'prix_unitaire' => $item->prix_unitaire
        ];
    });

    return response()->json([
        'id' => $panier->id,
        'user_id' => $panier->user_id,
        'items' => $items
    ]);
}

    /**
     * Ajouter un produit ou un pack dans le panier
     */
    public function add(Request $request)
    {
        $request->validate([
            'produit_id' => 'nullable|exists:produits,id',
            'pack_id' => 'nullable|exists:packs,id',
            'quantite' => 'required|integer|min:1',
        ]);

        if (!$request->produit_id && !$request->pack_id) {
            return response()->json(['message' => 'Vous devez spécifier un produit ou un pack.'], 422);
        }

        // Récupérer le panier de l'utilisateur
        $panier = Panier::firstOrCreate(
            ['user_id' => $request->user()->id]
        );

        // Déterminer le type d'élément à ajouter
        if ($request->produit_id) {
            $this->addProduit($panier, $request->produit_id, $request->quantite);
        } elseif ($request->pack_id) {
            $this->addPack($panier, $request->pack_id, $request->quantite);
        }

        return response()->json(['message' => 'Élément ajouté au panier avec succès']);
    }

    /**
     * Ajouter un produit au panier
     */
    private function addProduit($panier, $produitId, $quantite)
    {
        $produit = Produit::findOrFail($produitId);

        // Vérifier si le produit existe déjà dans le panier
        $existingItem = PanierItem::where('panier_id', $panier->id)
            ->where('produit_id', $produitId)
            ->whereNull('pack_id')
            ->first();

        if ($existingItem) {
            // Incrémenter la quantité
            $existingItem->quantite += $quantite;
            $existingItem->save();
        } else {
            // Créer un nouvel item
            PanierItem::create([
                'panier_id' => $panier->id,
                'produit_id' => $produit->id,
                'pack_id' => null,
                'quantite' => $quantite,
                'prix_unitaire' => $produit->prix,
            ]);
        }
    }

    /**
     * Ajouter un pack au panier
     */
    private function addPack($panier, $packId, $quantite)
    {
        $pack = Pack::findOrFail($packId);

        // Vérifier si le pack existe déjà dans le panier
        $existingItem = PanierItem::where('panier_id', $panier->id)
            ->where('pack_id', $packId)
            ->whereNull('produit_id')
            ->first();

        if ($existingItem) {
            // Incrémenter la quantité
            $existingItem->quantite += $quantite;
            $existingItem->save();
        } else {
            // Créer un nouvel item
            PanierItem::create([
                'panier_id' => $panier->id,
                'pack_id' => $pack->id,
                'produit_id' => null,
                'quantite' => $quantite,
                'prix_unitaire' => $pack->prix,
            ]);
        }
    }

    /**
     * Supprimer un élément du panier
     */




public function removeItem(Request $request, $itemId){
    $userId = $request->user()->id;
    $panier = Panier::where('user_id', $userId)->first();

    if (!$panier) {
        return response()->json(['message' => 'Panier introuvable'], 404);
    }

    // Cherche soit un produit, soit un pack
    $item = $panier->items()
        ->where(function($query) use ($itemId) {
            $query->where('produit_id', $itemId)
                  ->orWhere('pack_id', $itemId);
        })
        ->first();

    if ($item) {
        $item->delete();
    }

    // Recharge le panier avec les relations
    $panier->load('items.produit', 'items.pack');

    return response()->json($panier);
}





public function clear(Request $request)
{
    $userId = $request->user()->id;
    $panier = Panier::where('user_id', $userId)->first();

    if (!$panier) {
        return response()->json(['message' => 'Panier introuvable'], 404);
    }

    // Supprime toutes les lignes du panier
    $panier->items()->delete();

    // Retourne le panier vide
    $panier->load('items.produit', 'items.pack');
    return response()->json($panier);
}



public function updateQuantity(Request $request, $itemId)
{
    $request->validate([
        'quantite' => 'required|integer|min:0'
    ]);

    $userId = $request->user()->id;
    $panier = Panier::where('user_id', $userId)->first();

    if (!$panier) {
        return response()->json(['message' => 'Panier introuvable'], 404);
    }

    $item = $panier->items()->find($itemId);

    if (!$item) {
        return response()->json(['message' => 'Élément introuvable dans le panier'], 404);
    }

    if ($request->quantite == 0) {
        $item->delete(); // supprime si quantité = 0
    } else {
        $item->quantite = $request->quantite;
        $item->save();
    }

    $panier->load('items.produit', 'items.pack');
    return response()->json($panier);
}









}
