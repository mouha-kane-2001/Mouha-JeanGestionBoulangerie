<?php

namespace App\Http\Controllers;

use App\Models\Facture;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
class FactureController extends Controller
{
    /**
     * Liste des factures pour le client connecté
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $factures = Facture::with(['detailsFacture.produit', 'detailsFacture.pack'])
            ->where('user_id', $user->id)
            ->orderBy('date_emission', 'desc')
            ->get();

        return response()->json($factures);
    }

    /**
     * Afficher une facture spécifique pour le client
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();

        $facture = Facture::with(['detailsFacture.produit', 'detailsFacture.pack'])
            ->where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        return response()->json($facture);
    }

    /**
     * Télécharger la facture en PDF pour le client
     */
    public function download(Request $request, $id)
    {
        $user = $request->user();

        $facture = Facture::with(['detailsFacture.produit', 'detailsFacture.pack', 'commande'])
            ->where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $pdf = PDf::loadView('factures.pdf', [
            'facture' => $facture,
            'commande' => $facture->commande
        ]);

        return $pdf->download("facture-{$facture->numero_facture}.pdf");
    }

    /**
     * Liste des factures pour l'administration / gestion
     */
    public function adminIndex()
    {
        $factures = Facture::with(['user:id,prenom,nom,email', 'detailFactures.produit', 'detailFactures.pack'])
            ->orderBy('date_emission', 'desc')
            ->get();

        return response()->json($factures);
    }

    /**
     * Afficher une facture spécifique pour l'administration / gestion
     */
    public function adminShow($id)
    {
        $facture = Facture::with(['user:id,prenom,nom,email', 'detailFactures.produit', 'detailFactures.pack'])
            ->findOrFail($id);

        return response()->json($facture);
    }
}
