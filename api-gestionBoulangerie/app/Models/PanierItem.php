<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PanierItem extends Model
{
    use HasFactory;

    protected $fillable = ['panier_id', 'produit_id','pack_id', 'quantite', 'prix_unitaire'];

    public function panier()
    {
        return $this->belongsTo(Panier::class);
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
