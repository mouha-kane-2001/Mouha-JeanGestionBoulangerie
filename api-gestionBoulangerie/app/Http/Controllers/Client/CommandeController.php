<?php

namespace App\Http\Controllers\Client;

use App\Models\Commande;
use App\Models\Panier;
use App\Models\DetailCommande;
use App\Models\DetailFacture;
use App\Models\Facture;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;

class CommandeController extends Controller
{
    /**
     * Liste des commandes de l'utilisateur avec pagination
     */
    public function index(Request $request)
    {
        $query = Commande::with([
            'user:id,prenom,nom,telephone', // Utilisez prenom et nom
            'detailCommandes.produit',
            'facture:id,commande_id,statut'
        ]);

        // Filtres employé
        if ($request->has('statut')) {
            $query->where('statut', $request->statut);
        }

        if ($request->has('statut_livraison')) {
            $query->where('statut_livraison', $request->statut_livraison);
        }

        $commandes = $query->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 20);

        return response()->json($commandes);
    }

    /**
     * Détails d'une commande
     */
    public function show($id)
    {
        $commande = Commande::with([
            'user:id,prenom,nom,email,telephone,adresse', // prenom et nom
            'detailCommandes.produit:id,nom,prix,photo',
            'detailCommandes.pack:id,nom,prix',
            'facture:id,commande_id,numero_facture,montant_total,statut'
        ])->findOrFail($id);

        return response()->json($commande);
    }

    /**
     * Marquer comme en préparation
     */
    public function marquerEnPreparation($id)
    {
        $commande = Commande::findOrFail($id);

        $commande->update([
            'statut' => 'en_preparation',
            'statut_livraison' => 'en_preparation'
        ]);

        return response()->json([
            'message' => 'Commande en préparation',
            'commande' => $commande
        ]);
    }

    /**
     * Marquer comme prête
     */
    public function marquerPrete($id)
    {
        $commande = Commande::findOrFail($id);

        $commande->update([
            'statut' => 'prete', // Note: sans accent grave
            'statut_livraison' => 'prete'
        ]);

        return response()->json([
            'message' => 'Commande prête',
            'commande' => $commande
        ]);
    }

    /**
     * Marquer comme en livraison
     */
    public function marquerEnLivraison(Request $request, $id)
    {
        $request->validate([
            'numero_suivi' => 'required|string',
            'transporteur' => 'required|string',
            'estimation_livraison' => 'required|date'
        ]);

        $commande = Commande::findOrFail($id);

        $commande->update([
            'statut' => 'en_livraison',
            'statut_livraison' => 'en_livraison',
            'numero_suivi' => $request->numero_suivi,
            'transporteur' => $request->transporteur,
            'estimation_livraison' => $request->estimation_livraison
        ]);

        return response()->json([
            'message' => 'Commande en livraison',
            'commande' => $commande
        ]);
    }

    /**
     * Marquer comme livrée
     */
    public function marquerLivree($id)
    {
        $commande = Commande::findOrFail($id);

        $commande->update([
            'statut' => 'livree', // Note: sans accent grave
            'statut_livraison' => 'livree',
            'date_livraison' => now()
        ]);

        // Si paiement à la livraison, marquer facture comme payée
        if ($commande->mode_paiement === 'espece' && $commande->facture) {
            $commande->facture->update(['statut' => 'payee']);
        }

        return response()->json([
            'message' => 'Commande livrée',
            'commande' => $commande
        ]);
    }

    /**
     * Commandes nécessitant une action
     */
    public function commandesEnAttente()
    {
        $commandes = Commande::with(['user:id,prenom,nom']) // prenom et nom
            ->whereIn('statut', ['en_attente', 'en_preparation'])
            ->orderBy('created_at', 'asc')
            ->limit(50)
            ->get();

        return response()->json($commandes);
    }

    /**
     * Statistiques de préparation
     */
    public function statistiquesPreparation()
    {
        $stats = [
            'total_a_preparer' => Commande::whereIn('statut', ['en_attente', 'en_preparation'])->count(),
            'pretees' => Commande::where('statut', 'prete')->count(), // sans accent
            'en_livraison' => Commande::where('statut', 'en_livraison')->count(),
            'livrees_aujourdhui' => Commande::where('statut', 'livree') // sans accent
                ->whereDate('updated_at', today())
                ->count()
        ];

        return response()->json($stats);
    }

    /**
     * Mettre à jour seulement le statut de livraison
     */
    public function updateLivraison(Request $request, $id)
    {
        $request->validate([
            'statut_livraison' => 'required|in:en_attente,en_preparation,prete,en_livraison,livree'
        ]);

        $commande = Commande::findOrFail($id);
        $commande->update([
            'statut_livraison' => $request->statut_livraison
        ]);

        return response()->json([
            'message' => 'Statut livraison mis à jour',
            'commande' => $commande
        ]);
    }





    public function createFromPanier(Request $request)  {
         $request->validate([
            'mode_paiement' => 'required|in:en_ligne,a_la_livraison,espece',
            'adresse_livraison' => 'required|string|max:500'
        ]);
$statutFactures = ($request->mode_paiement === 'en_ligne') ? 'payee' : 'non_payee';

        $statut = 'en_attente';
        $statutLivraison = 'en_attente';

  if ($request->mode_paiement === 'en_ligne') {
    $statut = 'en_attente'; // ou 'en_preparation' selon ton workflow
    $statutLivraison = 'en_attente';
        $statutFacture = 'payee';
} else {
    $statut = 'en_attente';
    $statutLivraison = 'en_attente';
}

Log::info('Mode de paiement reçu : ' . $request->mode_paiement);
Log::info('StatutFacture : ' . ($statutFacture ?? 'non_paye'));


        $user = $request->user();
        $panier = Panier::where('user_id', $user->id)->with('items.produit', 'items.pack')->first();

        if (!$panier || $panier->items->isEmpty()) {
            return response()->json(['message' => 'Panier vide'], 422);
        }

        // Vérifier les stocks avant de créer la commande
        foreach ($panier->items as $item) {
            if ($item->produit_id && $item->produit->stock < $item->quantite) {
                return response()->json([
                    'message' => 'Stock insuffisant pour: ' . $item->produit->nom,
                    'produit' => $item->produit->nom,
                    'stock_disponible' => $item->produit->stock,
                    'quantite_demandee' => $item->quantite
                ], 422);
            }
        }

        // Calcul du total
        $total = $panier->items->sum(function($item) {
            if ($item->produit_id) {
                $prix = $item->produit->prix_promotion ?? $item->produit->prix;
                return $item->quantite * $prix;
            } else {
                return $item->quantite * $item->pack->prix;
            }
        });

        // Créer la commande
        $commande = Commande::create([
            'user_id' => $user->id,
            'mode_paiement' => $request->mode_paiement,
            'total' => $total,
            'statut' => $statut,
            'statut_livraison' => $statutLivraison,
            'adresse_livraison' => $request->adresse_livraison,
            'notes' => $request->notes
        ]);

        // Créer les détails de commande
        foreach ($panier->items as $item) {
            if ($item->produit_id) {
                $prixUnitaire = $item->produit->prix_promotion ?? $item->produit->prix;
                $prixOriginal = $item->produit->prix;

                // Mettre à jour le stock
                $item->produit->decrement('stock', $item->quantite);
            } else {
                $prixUnitaire = $item->pack->prix;
                $prixOriginal = $item->pack->prix;
            }

            DetailCommande::create([
                'commande_id' => $commande->id,
                'produit_id' => $item->produit_id,
                'pack_id' => $item->pack_id,
                'quantite' => $item->quantite,
                'prix_unitaire' => $prixUnitaire,
                'prix_original' => $prixOriginal,
                'promotion_appliquee' => $item->produit_id ? ($prixUnitaire < $prixOriginal) : false
            ]);
        }

        // Créer la facture automatiquement
        $facture = Facture::create([
            'commande_id' => $commande->id,
            'numero_facture' => 'FAC-' . strtoupper(Str::random(8)),
            'date_emission' => now(),
            'montant_total' => $commande->total,
            'statut' =>$statutFactures,
            'mode_paiement' => $commande->mode_paiement,
            'user_id' => $commande->user_id,
        ]);

        // Créer les détails facture
        foreach ($commande->detailCommandes as $detail) {
            DetailFacture::create([
                'facture_id' => $facture->id,
                'produit_id' => $detail->produit_id,
                'pack_id' => $detail->pack_id,
                'quantite' => $detail->quantite,
                'prix_unitaire' => $detail->prix_unitaire,
                'total_ligne' => $detail->quantite * $detail->prix_unitaire,
                'promotion_appliquee' => $detail->promotion_appliquee
            ]);
        }

        // Vider le panier
        $panier->items()->delete();

        return response()->json([
            'message' => 'Commande créée avec succès',
            'commande_id' => $commande->id,
            'facture_id' => $facture->id,
            'numero_facture' => $facture->numero_facture,
            'total' => $commande->total
        ], 201);
    }

    /**
     * Télécharger la facture en PDF
     */
    public function downloadFacture($commandeId, Request $request)
    {

        $commande = Commande::where('id', $commandeId)
            ->where('user_id', $request->user()->id)
            ->with(['facture.detailFactures.produit', 'facture.detailFactures.pack', 'user'])
            ->firstOrFail();

        $pdf = PDF::loadView('factures.pdf', [
            'commande' => $commande,
            'facture' => $commande->facture
        ]);

        return $pdf->download("facture-{$commande->facture->numero_facture}.pdf");
    }

    /**
     * Suivi de livraison
     */
    public function suiviLivraison($id, Request $request)
    {
        $commande = Commande::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        return response()->json([
            'statut' => $commande->statut,
            'statut_livraison' => $commande->statut_livraison,
            'numero_suivi' => $commande->numero_suivi,
            'transporteur' => $commande->transporteur,
            'estimation_livraison' => $commande->estimation_livraison,
            'date_livraison' => $commande->date_livraison
        ]);
    }

    /**
     * Annuler une commande (si possible)
     */
    public function annuler($id, Request $request)
    {
        $commande = Commande::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        // Vérifier si la commande peut être annulée
        if ($commande->statut !== 'en_attente') {
            return response()->json([
                'message' => 'Impossible d\'annuler la commande. Statut actuel: ' . $commande->statut
            ], 422);
        }

        $commande->update([
            'statut' => 'annulee',
            'statut_livraison' => 'annulee'
        ]);

        // Restaurer les stocks si annulation
        foreach ($commande->detailCommandes as $detail) {
            if ($detail->produit_id) {
                $detail->produit->increment('stock', $detail->quantite);
            }
        }

        return response()->json([
            'message' => 'Commande annulée avec succès',
            'commande' => $commande
        ]);
    }










}
