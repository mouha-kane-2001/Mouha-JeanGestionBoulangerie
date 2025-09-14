<?php

namespace App\Http\Controllers\Gestionnaire;

use App\Http\Controllers\Controller;
use App\Mail\CommandeMiseAJour;
use App\Models\Commande;
use App\Models\Facture;
use App\Models\Promotion;
use App\Notifications\CommandeEnLivraison;
use App\Notifications\CommandeLivree;
use App\Notifications\FactureGeneree;
use App\Notifications\StatutCommandeModifie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;







class GestionnaireCommandeController extends Controller
{
    public function __construct()
    {
     }


     private function envoyerEmailMiseAJour(Commande $commande, array $modifications = [])
    {
        if ($commande->user && $commande->user->email) {
            try {
                Mail::to($commande->user->email)
                    ->send(new CommandeMiseAJour($commande, $modifications));
            } catch (\Exception $e) {
                // Loguer l'erreur mais ne pas interrompre le processus
                Log::error('Erreur envoi email commande: ' . $e->getMessage());
            }
        }
    }

    /**
     * Liste des commandes à préparer
     */
    public function index(Request $request)
    {
        $query = Commande::with([
            'user:id,nom,telephone',
            'detailCommandes.produit',
            'facture:id,commande_id,statut'
        ]);

        // Filtres employé
        if ($request->has('statut_livraison')) {
            $query->where('statut_livraison', $request->statut_livraison);
        }

        if ($request->has('statut')) {
            $query->where('statut', $request->statut);
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
            'user:id,name,email,phone,adresse',
            'detailCommandes.produit:id,nom,prix,photo',
            'detailCommandes.pack:id,nom,prix',
            'facture:id,commande_id,numero_facture,montant_total'
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

         $this->envoyerEmailMiseAJour($commande, [
            'statut' => 'en préparation',
            'statut_livraison' => 'en préparation'
        ]);

        // Notification client
        if ($commande->user) {
            $commande->user->notify(new StatutCommandeModifie($commande));
        }

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
            'statut' => 'prete',
            'statut_livraison' => 'prete'
        ]);
        // Envoyer email au client
        $this->envoyerEmailMiseAJour($commande, [
            'statut' => 'prête',
            'statut_livraison' => 'prête'
        ]);

        // Notification client
        if ($commande->user) {
            $commande->user->notify(new StatutCommandeModifie($commande));
        }

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
         // Envoyer email au client
        $this->envoyerEmailMiseAJour($commande, [
            'statut' => 'en livraison',
            'numero_suivi' => $request->numero_suivi,
            'transporteur' => $request->transporteur,
            'estimation_livraison' => $request->estimation_livraison
        ]);

        // Notification client avec numéro de suivi
        if ($commande->user) {
            $commande->user->notify(new CommandeEnLivraison($commande));
        }

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
            'statut' => 'livree',
            'statut_livraison' => 'livree',
            'date_livraison' => now()
        ]);
        // Envoyer email au client
        $this->envoyerEmailMiseAJour($commande, [
            'statut' => 'livrée',
            'statut_livraison' => 'livrée',
            'date_livraison' => now()->format('d/m/Y H:i')
        ]);

        // Si paiement à la livraison, marquer facture comme payée
        if ($commande->mode_paiement === 'espece' && $commande->facture) {
            $commande->facture->update(['statut' => 'payee']);
        }
         if ($commande->mode_paiement === 'a_la_livraison' && $commande->facture) {
            $commande->facture->update(['statut' => 'payee']);
        }

        // Notification client
        if ($commande->user) {
            $commande->user->notify(new CommandeLivree($commande));
        }

        return response()->json([
            'message' => 'Commande livree',
            'commande' => $commande
        ]);
    }

    /**
     * Générer et envoyer une facture
     */
    public function genererFacture($id)
    {
        $commande = Commande::with(['user', 'detailCommandes.produit', 'detailCommandes.pack'])
            ->findOrFail($id);

        // Vérifier si une facture existe déjà
        if (!$commande->facture) {
            $facture = Facture::create([
                'commande_id' => $commande->id,
                'numero_facture' => 'FACT-' . date('Ymd') . '-' . $commande->id,
                'montant_total' => $commande->montant_total,
                'statut' => $commande->mode_paiement === 'en_ligne' ? 'payée' : 'en_attente'
            ]);
        } else {
            $facture = $commande->facture;
        }

        // Générer le PDF
        $pdf = PDF::loadView('factures.template', compact('commande', 'facture'));

        // Sauvegarder le PDF
        $fileName = 'facture-' . $facture->numero_facture . '.pdf';
        $path = 'factures/' . $fileName;
        Storage::put($path, $pdf->output());

        // Enregistrer le chemin dans la facture
        $facture->update(['fichier' => $path]);

        // Envoyer la facture par email
        if ($commande->user) {
            $commande->user->notify(new FactureGeneree($commande, $facture));
        }

        return response()->json([
            'message' => 'Facture générée et envoyée avec succès',
            'facture' => $facture,
            'download_url' => route('factures.download', $facture->id)
        ]);
    }

    /**
     * Télécharger une facture
     */
    public function downloadFacture($id)
    {
        $facture = Facture::findOrFail($id);

        // Vérifier que l'utilisateur a le droit de télécharger cette facture
        //if (!auth()->user()->can('gestionnaire-access') && auth()->id() !== $facture->commande->user_id) {
        //    abort(403);
        //}

        return Storage::download($facture->fichier);
    }

    /**
     * Commandes nécessitant une action
     */
    public function commandesEnAttente()
    {
        $commandes = Commande::with(['user:id,name'])
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
            'pretees' => Commande::where('statut', 'prête')->count(),
            'en_livraison' => Commande::where('statut', 'en_livraison')->count(),
            'livrees_aujourdhui' => Commande::where('statut', 'livrée')
                ->whereDate('updated_at', today())
                ->count()
        ];

        return response()->json($stats);
    }

    /**
     * Appliquer une promotion à une commande
     */
    public function appliquerPromotion(Request $request, $id)
    {
        $request->validate([
            'code_promotion' => 'required|exists:promotions,code'
        ]);

        $commande = Commande::findOrFail($id);
        $promotion = Promotion::where('code', $request->code_promotion)
            ->where('date_debut', '<=', now())
            ->where('date_fin', '>=', now())
            ->firstOrFail();

        // Vérifier si la promotion est applicable
        if ($promotion->est_valide) {
            // Appliquer la promotion
            $commande->update([
                'promotion_id' => $promotion->id,
                'reduction' => $promotion->valeur,
                'montant_total' => $commande->montant_total - $promotion->valeur
            ]);

            return response()->json([
                'message' => 'Promotion appliquée avec succès',
                'commande' => $commande
            ]);
        }

        return response()->json([
            'message' => 'Promotion non valide'
        ], 422);
    }







public function destroy($id)
    {

        $commande = Commande::find($id);
        if (!$commande) {
            return response()->json(['message' => 'Commande introuvable'], 404);
        }

        try {
            $commande->delete();
            return response()->json(['message' => 'Commande supprimée avec succès']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur lors de la suppression', 'error' => $e->getMessage()], 500);
        }
    }


}
