<?php

namespace App\Notifications;

use App\Models\Commande;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CommandeEnLivraison extends Notification implements ShouldQueue
{
    use Queueable;

    public $commande;

    public function __construct(Commande $commande)
    {
        $this->commande = $commande;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Votre commande est en cours de livraison')
            ->line('Votre commande n°' . $this->commande->id . ' est maintenant en cours de livraison.')
            ->line('Numéro de suivi: ' . $this->commande->numero_suivi)
            ->line('Transporteur: ' . $this->commande->transporteur)
            ->action('Voir les détails', url('/commandes/' . $this->commande->id))
            ->line('Merci pour votre confiance!');
    }

    public function toArray($notifiable)
    {
        return [
            'commande_id' => $this->commande->id,
            'message' => 'Votre commande est en cours de livraison',
            'numero_suivi' => $this->commande->numero_suivi,
        ];
    }
}
