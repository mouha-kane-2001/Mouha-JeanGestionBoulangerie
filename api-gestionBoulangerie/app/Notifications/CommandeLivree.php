<?php

namespace App\Notifications;

use App\Models\Commande;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CommandeLivree extends Notification implements ShouldQueue
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
            ->subject('Votre commande a été livrée')
            ->line('Votre commande n°' . $this->commande->id . ' a été livrée avec succès.')
            ->line('Date de livraison: ' . $this->commande->date_livraison->format('d/m/Y H:i'))
            ->action('Évaluer votre expérience', url('/commandes/' . $this->commande->id . '/feedback'))
            ->line('Merci pour votre achat!');
    }

    public function toArray($notifiable)
    {
        return [
            'commande_id' => $this->commande->id,
            'message' => 'Votre commande a été livrée',
            'date_livraison' => $this->commande->date_livraison,
        ];
    }
}
