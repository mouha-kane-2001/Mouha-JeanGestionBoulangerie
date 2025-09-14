<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetailCommande extends Model
{
    protected $fillable = [
        'commande_id',
        'produit_id',
        'pack_id',
        'quantite',
        'prix_unitaire',
        'prix_original',
    'promotion_appliquee'
    ];

    public function commande()
    {
        return $this->belongsTo(Commande::class);
    }

    public function produit()
    {
        return $this->belongsTo(Produit::class);
    }

    public function pack()
    {
        return $this->belongsTo(Pack::class);
    }
}
