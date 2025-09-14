<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetailFacture extends Model
{
 protected $table = 'details_factures';

    protected $fillable = [
        'facture_id',
        'produit_id',
        'quantite',
        'prix_unitaire',
        'total_ligne',
    ];

    /**
     * Relation avec la facture.
     */
    public function facture()
    {
        return $this->belongsTo(Facture::class);
    }

    /**
     * Relation avec le produit.
     */
    public function produit()
    {
        return $this->belongsTo(Produit::class);
    }
      public function pack()
    {
        return $this->belongsTo(Pack::class);
    }
}
