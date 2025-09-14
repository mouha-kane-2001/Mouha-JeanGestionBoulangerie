<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Commande extends Model
{
    protected $table = 'commandes';

    protected $fillable = [
        'user_id',
        'mode_paiement',
        'statut',
        'total',
        'statut_livraison',
        'numero_suivi',
        'transporteur',
        'estimation_livraison',
        'date_livraison',
        'adresse_livraison',
        'notes'
    ];
  protected $casts = [
        'total' => 'decimal:2',
        'estimation_livraison' => 'datetime',
        'date_livraison' => 'datetime'
    ];

    /**
     * Relation avec l'utilisateur.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relation avec les détails de commande.
     */
    public function detailCommandes()
    {
        return $this->hasMany(DetailCommande::class);
    }

    /**
     * Relation avec la facture.
     */
    public function facture()

  {
        return $this->hasOne(Facture::class);
    }
    /**
     * Relation avec la livraison.
     */

}
