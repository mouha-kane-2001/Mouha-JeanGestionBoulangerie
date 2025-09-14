<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Facture;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class FactureAdminController extends Controller
{
    /**
     * Display a listing of the resource.



     * Liste de toutes les factures (admin)
     */
    public function index()
    {
        $factures = Facture::with([
            'user:id,prenom,nom,email',
            'detailsFacture.produit',
            'detailsFacture.pack'
        ])
            ->orderBy('date_emission', 'desc')
            ->get();

        return response()->json($factures);
    }

    /**
     * Afficher une facture spécifique (admin)
     */
    public function show(string $id)
    {
        $facture = Facture::with([
            'user:id,prenom,nom,email',
            'detailsFacture.produit',
            'detailsFacture.pack'
        ])
            ->findOrFail($id);

        return response()->json($facture);
    }

    /**
     * Création d'une facture (optionnel, si admin veut créer manuellement)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'commande_id' => 'required|exists:commandes,id',
            'montant_total' => 'required|numeric',
            'date_emission' => 'required|date',
        ]);

        $facture = Facture::create($validated);

        return response()->json([
            'message' => 'Facture créée avec succès',
            'facture' => $facture
        ], 201);
    }

    /**
     * Mise à jour d'une facture (rare, mais possible en cas de correction)
     */
    public function update(Request $request, string $id)
    {
        $facture = Facture::findOrFail($id);

        $validated = $request->validate([
            'montant_total' => 'sometimes|numeric',
            'date_emission' => 'sometimes|date',
        ]);

        $facture->update($validated);

        return response()->json([
            'message' => 'Facture mise à jour avec succès',
            'facture' => $facture
        ]);
    }

    /**
     * Suppression d'une facture
     */
     public function destroy($id)
    {
        $facture = Facture::find($id);
        if (!$facture) {
            return response()->json(['message' => 'Facture introuvable'], 404);
        }

        try {
            $facture->delete();
            return response()->json(['message' => 'Facture supprimée avec succès']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la suppression',
                'error' => $e->getMessage()
            ], 500);
        }
    }







    public function marquerCommePayee($id)
{
    $facture = Facture::find($id);
    if (!$facture) {
        return response()->json(['message' => 'Facture introuvable'], 404);
    }
    $facture->statut = 'payee';

    $facture->save();

    return response()->json(['message' => 'Facture marquée comme payée']);

}




public function download($id)
{
    $facture = Facture::with(['detailsFacture.produit', 'detailsFacture.pack', 'commande'])
        ->findOrFail($id);

    $pdf = Pdf::loadView('factures.pdf', [
        'facture' => $facture,
        'commande' => $facture->commande
    ]);

    return $pdf->download("facture-{$facture->numero_facture}.pdf");
}


}
