<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Categorie extends Model
{
    protected $table = 'categories';

    protected $fillable = [
        'nom',
    ];

    /**
     * Get the produits for the category.
     */
    public function produits()
    {
        return $this->hasMany(Produit::class);
    }
}
