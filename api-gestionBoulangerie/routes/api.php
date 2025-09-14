<?php

use App\Http\Controllers\Admin\AdminCommandeController;
use App\Http\Controllers\Admin\FactureAdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategorieController;
use App\Http\Controllers\Client\CommandeController;
use App\Http\Controllers\dashboard\ClientDashboardController;
use App\Http\Controllers\dashboard\EmployeDashboardController;
use App\Http\Controllers\FactureController;
use App\Http\Controllers\Gestionnaire\GestionnaireCommandeController;
use App\Http\Controllers\OpenAIController;
use App\Http\Controllers\PackController;
use App\Http\Controllers\PanierController;
use App\Http\Controllers\ProduitController;
use App\Http\Controllers\PromotionController;
use App\Http\Controllers\SupportController;
use App\Http\Controllers\UtilisateurController;
use GuzzleHttp\Psr7\Request;
use Illuminate\Support\Facades\Route;
use Tymon\JWTAuth\Facades\JWTAuth;

/*
|--------------------------------------------------------------------------
| Routes API (JWT)
|--------------------------------------------------------------------------
*/

// Authentification
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('jwt.auth');

// Routes protégées par JWT
Route::group(['middleware' => ['jwt.auth']], function () {

   Route::get('/user', function (Request $request) {
    try {
        $user = JWTAuth::parseToken()->authenticate();
        return response()->json($user);
    } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
        return response()->json(['message' => 'Token invalide'], 401);
    }
})->middleware('jwt.auth');
    // Gestion des utilisateurs
    Route::get('/utilisateurs', [UtilisateurController::class, 'index']);
    Route::get('/utilisateurs/{utilisateur}', [UtilisateurController::class, 'show']);
    Route::post('/utilisateurs', [UtilisateurController::class, 'store']);
    Route::put('/utilisateurs/{utilisateur}', [UtilisateurController::class, 'update']);
    Route::delete('/utilisateurs/{utilisateur}', [UtilisateurController::class, 'destroy']);
     Route::patch('/utilisateurs/{id}/changer-role', [UtilisateurController::class, 'changerRole']);


    // Gestion des catégories
    Route::get('/categories', [CategorieController::class, 'index']);
    Route::get('/categories/{categorie}', [CategorieController::class, 'show']);
    Route::post('/categories', [CategorieController::class, 'store']);
    Route::put('/categories/{categorie}', [CategorieController::class, 'update']);
    Route::delete('/categories/{categorie}', [CategorieController::class, 'destroy']);

    // Produits
    Route::apiResource('produits', ProduitController::class);
    Route::put('produits/{produit}/stock', [ProduitController::class, 'updateStock']);
    // Promotions
    Route::apiResource('promotions', PromotionController::class);

    // Packs
    Route::apiResource('packs', PackController::class);



    Route::post('/panier/add', [PanierController::class, 'add'])->name('panier.add');
    Route::get('/panier', [PanierController::class, 'get']);      // pour récupérer le panier
    Route::delete('/panier/remove/{id}', [PanierController::class, 'removeItem']);
    Route::delete('/panier/clear', [PanierController::class, 'clear']);
    Route::patch('/panier/update/{itemId}', [PanierController::class, 'updateQuantity']);
    Route::post('/panier/commande', [ CommandeController::class, 'createFromPanier']);

       Route::get('/commandes/mes', [CommandeController::class, 'index']);
        Route::get('/commandes', [GestionnaireCommandeController::class, 'index']);
       Route::get('/commandes/{id}/details', [CommandeController::class, 'show']);
Route::post('/commandes/{id}/annuler', [CommandeController::class, 'annuler']);


     Route::get('/factures', [FactureController::class, 'index']);
    Route::get('/factures/{id}', [FactureController::class, 'show']);

    Route::get('/factures/{id}/download', [FactureController::class, 'download']);

     Route::get('/employe/dashboard', [EmployeDashboardController::class, 'index']);
          Route::get('/employe/dashboard/commandes', [EmployeDashboardController::class, 'dernieresCommandes']);




        Route::prefix('admin')->group(function () {


     Route::get('/factures/{id}/download', [FactureAdminController::class, 'download']);

    // Statistiques commandes
    Route::get('/commandes-stats', [AdminCommandeController::class, 'commandesStats']);

    // Statistiques revenus
    Route::get('/revenus-stats', [AdminCommandeController::class, 'revenusStats']);

    // Top produits
    Route::get('/produits-top', [AdminCommandeController::class, 'produitsTop']);

    // Promotions actives
    Route::get('/promotions-actives', [AdminCommandeController::class, 'promotionsActives']);

    // Statistiques clients
    Route::get('/clients-stats', [AdminCommandeController::class, 'clientsStats']);

    // Produits en stock critique
    Route::get('/stock-critique', [AdminCommandeController::class, 'stockCritique']);

    Route::delete('/factures/{id}', [FactureController::class, 'destroy']);
     Route::patch('/factures/{id}/payee', [FactureAdminController::class, 'marquerCommePayee']);
    Route::apiResource('factures', FactureAdminController::class);


});





   Route::prefix('client')->group(function () {
    Route::get('dashboard', [ClientDashboardController::class, 'index']);

    // Détail d'une commande spécifique
    Route::get('commandes/{id}', [ClientDashboardController::class, 'commandeDetails']);

    // Télécharger une facture PDF
  //  Route::get('facture/{id}/download', [ClientDashboardController::class, 'telechargerFacture']);
    Route::get('/support/conversations', [SupportController::class, 'listConversations']);
     Route::post('/support/conversationsCreer', [SupportController::class, 'createConversation']);

Route::get('/support/conversations/{id}/messages', [SupportController::class, 'getMessages']);
Route::post('/support/conversations/{id}/messages', [SupportController::class, 'sendMessage']);





});











Route::prefix('employe')->group(function () {
    // Lister toutes les conversations ouvertes pour l'employé
    Route::get('/support/conversations', [SupportController::class, 'listConversationsEmploye']);

    // Lister les messages d’une conversation spécifique
    Route::get('/support/conversations/{id}/messages', [SupportController::class, 'getMessagesEmploye']);

    // Envoyer un message dans une conversation
    Route::post('/support/conversations/{id}/messages', [SupportController::class, 'sendMessageEmploye']);
});

    Route::patch('/commandes/{id}/en-preparation', [GestionnaireCommandeController::class, 'marquerEnPreparation']);
        Route::patch('/commandes/{id}/prete', [GestionnaireCommandeController::class, 'marquerPrete']);
        Route::patch('/commandes/{id}/en-livraison', [GestionnaireCommandeController::class, 'marquerEnLivraison']);
                    Route::patch('/commandes/{id}/en-preparation', [GestionnaireCommandeController::class, 'marquerEnPreparation']);

        Route::patch('/commandes/{id}/livree', [GestionnaireCommandeController::class, 'marquerLivree']);




Route::post('/openai-chat', [OpenAIController::class, 'chat']);
Route::delete('/commandes/{id}', [GestionnaireCommandeController::class, 'destroy']);




});
