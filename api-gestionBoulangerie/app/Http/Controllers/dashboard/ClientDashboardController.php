<?php

namespace App\Http\Controllers\dashboard;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use App\Models\Facture;
use App\Models\PanierItem;
use App\Models\Produit;
 use Illuminate\Http\Request;

class ClientDashboardController extends Controller
{

/**
     * Retourne le dashboard complet du client
     */
    public function index(Request $request)
    {
        $client = $request->user();

        // Historique des commandes avec statut et détails
        $commandes = Commande::with(['detailCommandes.produit', 'facture'])
                             ->where('user_id', $client->id)
                             ->orderBy('created_at', 'desc')
                             ->get();

        // Historique des factures séparément (si besoin)
        $factures = Facture::where('user_id', $client->id)
                           ->with('commande')
                           ->orderBy('date_emission', 'desc')
                           ->get();

        // Historique du panier (derniers items ajoutés)
        $panierItems = PanierItem::with(['produit', 'pack'])
                                 ->whereHas('panier', function($q) use ($client){
                                     $q->where('user_id', $client->id);
                                 })
                                 ->orderBy('created_at', 'desc')
                                 ->get();

        // Suggestions de produits (exemple simple : produits similaires aux derniers achats)
        $produitsAchetes = $commandes->flatMap(fn($c) => $c->detailCommandes->pluck('produit_id'));
        $suggestions = Produit::whereIn('categorie_id', function($query) use ($produitsAchetes) {
                                $query->select('categorie_id')
                                      ->from('produits')
                                      ->whereIn('id', $produitsAchetes);
                             })
                             ->take(5)
                             ->get();

        return response()->json([
            'commandes' => $commandes,
            'factures' => $factures,
            'panier_items' => $panierItems,
            'suggestions_produits' => $suggestions
        ], 200);
    }

    /**
     * Détail d'une commande spécifique (optionnel)
     */
    public function commandeDetails($id, Request $request)
    {
        $client = $request->user();

        $commande = Commande::with(['detailCommandes.produit', 'facture'])
                            ->where('id', $id)
                            ->where('user_id', $client->id)
                           ->orderBy('created_at', 'desc')
                             ->take(6)
                             ->get();

        if (!$commande) {
            return response()->json(['message' => 'Commande non trouvée'], 404);
        }

        return response()->json($commande, 200);
    }

    /**
     * Téléchargement d'une facture PDF
     */
    public function telechargerFacture($id, Request $request)
    {
        $client = $request->user();

        $facture = Facture::where('id', $id)
                          ->where('user_id', $client->id)
                          ->first();

        if (!$facture) {
            return response()->json(['message' => 'Facture non trouvée'], 404);
        }

        return response()->json(['pdf_url' => $facture->pdf_path], 200);
    }
}
