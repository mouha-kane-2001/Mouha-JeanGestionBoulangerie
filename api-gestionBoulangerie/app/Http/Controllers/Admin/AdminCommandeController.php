<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use App\Models\DetailCommande;
use App\Models\DetailFacture;
use App\Models\Facture;
use App\Models\Promotion;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

class AdminCommandeController extends Controller
{
    /**
     * Liste complète des commandes
     */
    /**
     * Commandes : total, par statut, du jour
     */
    public function commandesStats()
    {
        $today = Carbon::today();

        $totalCommandes   = Commande::count();
        $commandesDuJour  = Commande::whereDate('created_at', $today)->count();

        $commandesParStatut = Commande::select('statut', DB::raw('count(*) as total'))
            ->groupBy('statut')
            ->pluck('total', 'statut');

        return response()->json([
            'total'        => $totalCommandes,
            'duJour'       => $commandesDuJour,
            'enPreparation'=> $commandesParStatut['en_preparation'] ?? 0,
            'enLivraison'  => $commandesParStatut['en_livraison'] ?? 0,
            'livrees'      => $commandesParStatut['livree'] ?? 0,
            'annulees'     => $commandesParStatut['annulee'] ?? 0,
        ]);
    }

    /**
     * Revenus total + du jour
     */
    public function revenusStats()
    {
        $today = Carbon::today();

        return response()->json([
            'total' => Facture::sum('montant_total'),
            'duJour' => Facture::whereDate('date_emission', $today)->sum('montant_total'),
        ]);
    }

    /**
     * Top 5 produits les plus vendus
     */
    public function produitsTop()
    {
        $produits = DetailCommande::select('produit_id', DB::raw('SUM(quantite) as total_vendu'))
            ->groupBy('produit_id')
            ->orderByDesc('total_vendu')
            ->with('produit')
            ->take(5)
            ->get();

        return response()->json($produits);
    }

    /**
     * Nombre de promotions actives
     */
    public function promotionsActives()
    {
        $count = Promotion::where('date_debut', '<=', now())
            ->where('date_fin', '>=', now())
            ->count();

        return response()->json(['promotionsActives' => $count]);
    }

    /**
     * Clients (total + nouveaux du jour)
     */
    public function clientsStats()
    {
        $today = Carbon::today();

        return response()->json([
            'nouveaux' => User::whereDate('created_at', $today)->count(),
            'total'    => User::where('role', 'client')->count(),
        ]);
    }

    /**
     * Produits en stock critique (<10)
     */
    public function stockCritique()
    {
        $produits = DB::table('produits')
            ->where('stock', '<', 10)
            ->select('id', 'nom', 'stock')
            ->get();

        return response()->json($produits);
    }




}
