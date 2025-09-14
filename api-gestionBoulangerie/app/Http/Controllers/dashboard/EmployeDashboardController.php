<?php

namespace App\Http\Controllers\dashboard;

use App\Http\Controllers\Controller;
use App\Models\Commande;
 use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EmployeDashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
public function index(Request $request)
{
    // Récupérer l'employé connecté
    $employeId = $request->user()->id;

    // Nombre de commandes à préparer
    $aPreparer = Commande::where('statut', 'en_attente')->count();

    // Commandes en cours de préparation par cet employé
    $enCours = Commande::where('statut', 'en_preparation')
                         ->count();

    // Commandes en cours de livraison
    $enLivraison = Commande::where('statut_livraison', 'en_livraison')->count();

    // Commandes terminées aujourd'hui par cet employé
    $livreesAujourdhui = Commande::where('statut', 'livree')
                                 ->whereDate('updated_at', today())
                                ->count();

    // Commandes urgentes (à livrer dans moins de 2 heures)
    $urgentes = Commande::where('statut', 'en_attente')
                        ->where('estimation_livraison', '<=', now()->addHours(2))
                        ->count();

    // Dernières commandes reçues
    $dernieresCommandes = Commande::with(['user', 'detailCommandes.produit', 'detailCommandes.pack'])
                               ->latest()
                               ->take(5)
                               ->get();

    // Produits les plus commandés aujourd'hui (pour anticiper la préparation)
    $produitsPopulaires = DB::table('detail_commandes')
        ->join('produits', 'detail_commandes.produit_id', '=', 'produits.id')
        ->join('commandes', 'detail_commandes.commande_id', '=', 'commandes.id')
        ->whereDate('commandes.created_at', today())
        ->select('produits.nom', DB::raw('SUM(detail_commandes.quantite) as total'))
        ->groupBy('produits.id', 'produits.nom')
        ->orderByDesc('total')
        ->take(5)
        ->get();

    // AJOUTEZ CE RETURN MANQUANT :
    return response()->json([
        'a_preparer' => $aPreparer,
        'en_preparation' => $enCours, // Note: j'ai changé 'en_cours' en 'en_preparation'
        'en_livraison' => $enLivraison,
        'livrees_aujourdhui' => $livreesAujourdhui,
        'urgentes' => $urgentes,
        'dernieres_commandes' => $dernieresCommandes,
        'produits_populaires' => $produitsPopulaires,
    ]);
}





 public function dernieresCommandes(Request $request)
    {
        $dernieresCommandes = Commande::with('user')
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'dernieres_commandes' => $dernieresCommandes
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
