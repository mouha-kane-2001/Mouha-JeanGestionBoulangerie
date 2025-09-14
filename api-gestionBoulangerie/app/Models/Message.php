<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
   use HasFactory;

    protected $fillable = [
        'conversation_id',
        'user_id',
        'type',
        'contenu',
        'lu_le',
    ];

    /**
     * Conversation à laquelle appartient le message
     */
    public function conversation()
    {
        return $this->belongsTo(Conversation::class);
    }

    /**
     * Utilisateur qui a écrit le message (nullable si system/IA)
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Marquer le message comme lu
     */
    public function markAsRead()
    {
        $this->lu_le = now();
        $this->save();
    }
}
