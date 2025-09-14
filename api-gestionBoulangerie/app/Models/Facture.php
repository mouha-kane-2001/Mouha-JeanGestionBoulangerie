<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Facture extends Model
{
    protected $table = 'factures';

    protected $fillable = [
        'commande_id', // ID de la commande associée
        'numero_facture', // Numéro de la facture
        'date_emission', // Date d'émission de la facture
        'montant_total', // Montant total de la facture
        'pdf_path',
        'user_id',
        'statut',        // <-- ajouter




        // chemin vers le PDF généré
    ];
protected $dates = ['date_emission'];
    /**
     * Relation avec la commande.
     */
    public function commande()
    {
        return $this->belongsTo(Commande::class);
    }
    /**
     * Relation avec les détails de la facture.
     */
    public function detailsFacture()
    {
        return $this->hasMany(DetailFacture::class);
    }

// Relation avec l'utilisateur
    public function user()
    {
        return $this->belongsTo(User::class);
    }


    public function getPdfPathAttribute($value)
    {
        return asset($value); // Retourne l'URL complète du PDF
    }
    /**
     * Set the PDF file path.
     */
    public function setPdfPathAttribute($value)
    {        $this->attributes['pdf_path'] = $value ? 'storage/' . $value : null; // Stocke le chemin relatif
        // Assurez-vous que le chemin est relatif à la racine du stockage
        if ($value && !str_starts_with($value, 'storage/')) {
            $this->attributes['pdf_path'] = 'storage/' . $value;
        }
        // Si le chemin est vide, on le met à null
        if (empty($value)) {
            $this->attributes['pdf_path'] = null;
        }
    }
}
