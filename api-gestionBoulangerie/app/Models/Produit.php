<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Produit extends Model
{
   use HasFactory;

    protected $table = 'produits';

    protected $fillable = [
        'categorie_id',
        'nom',
        'description',
        'prix',
        'stock',
        'photo',
        'allergenes',
    ];
      protected $appends = ['prix_promotion', 'en_promo'];
   protected $casts = [
    'allergenes' => 'array',
];

    // Relation avec catégorie
    public function categorie()
    {
        return $this->belongsTo(Categorie::class);
    }
    // Relation avec les détails de commande
    public function detailCommandes()
    {
        return $this->hasMany(DetailCommande::class);
    }
    public function getPhotoAttribute($value)
{
    return $value ? url('storage/' . $value) : null;
}

 public function promotions()
{
    return $this->belongsToMany(Promotion::class, 'produit_promotion', 'produit_id', 'promotion_id')
                ->withTimestamps();
}


public function getPrixPromotionAttribute()
    {
        $promotionActive = $this->promotions()
            ->where('date_debut', '<=', now())
            ->where('date_fin', '>=', now())
            ->first();

        if (!$promotionActive) {
            return null;
        }

        if ($promotionActive->type_reduction === 'pourcentage') {
            return round($this->prix - ($this->prix * ($promotionActive->valeur_reduction / 100)), 2);
        }

        if ($promotionActive->type_reduction === 'montant') {
            return max(0, $this->prix - $promotionActive->valeur_reduction);
        }

        return null;
    }

     public function getEnPromoAttribute()
    {
        return $this->promotions()
            ->where('date_debut', '<=', now())
            ->where('date_fin', '>=', now())
            ->exists();
    }
}


