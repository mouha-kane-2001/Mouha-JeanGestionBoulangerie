<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Promotion extends Model
{
    protected $table = 'promotions';

    protected $fillable = [

        'nom', // Nom de la promotion
        'description', // Description de la promotion
        'type_reduction',    // 'pourcentage' ou 'montant'
      'valeur_reduction',
        'date_debut', // Date et heure de début de la promotion
        'date_fin', // Date et heure de fin de la promotion
     ];

   protected $casts = [
    'date_debut' => 'datetime',
    'date_fin'   => 'datetime',
];

    /**
     * Relation avec les produits.
     */
   public function produits()
{
    return $this->belongsToMany(Produit::class, 'produit_promotion', 'promotion_id', 'produit_id');
}

}
