<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
   use HasFactory;

    protected $fillable = [
        'user_id',
        'sujet',
        'statut',
    ];

    /**
     * Utilisateur qui a ouvert la conversation (client)
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Messages de la conversation
     */
    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    /**
     * Messages non lus
     */
    public function unreadMessages()
    {
        return $this->messages()->whereNull('lu_le');
    }
}
