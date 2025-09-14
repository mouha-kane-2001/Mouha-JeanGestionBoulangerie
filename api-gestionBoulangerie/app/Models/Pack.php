<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pack extends Model
{
    /** @use HasFactory<\Database\Factories\PackFactory> */
    use HasFactory;
    protected $table = 'packs';
    protected $fillable = [
        'nom', // Nom du pack
        'description', // Description du pack
        'prix',
        'photo',// Prix total du pack
     ];

    public function produits()
    {
        return $this->belongsToMany(Produit::class, 'pack_produit', 'pack_id', 'produit_id');
    }
    /**
     * Relation avec les produits du pack.
     */

}
