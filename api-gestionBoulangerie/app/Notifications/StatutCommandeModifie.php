<?php

namespace App\Notifications;

use App\Models\Commande;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class StatutCommandeModifie extends Notification implements ShouldQueue
{
    use Queueable;

    public $commande;

    /**
     * Create a new notification instance.
     */
    public function __construct(Commande $commande)
    {
        $this->commande = $commande;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Statut de votre commande mis à jour')
            ->line('Le statut de votre commande n°' . $this->commande->id . ' a été modifié.')
            ->line('Nouveau statut: ' . $this->commande->statut)
            ->action('Voir ma commande', url('/commandes/' . $this->commande->id))
            ->line('Merci de votre confiance!');
    }

    /**
     * Get the array representation for database storage.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'commande_id' => $this->commande->id,
            'message' => 'Le statut de votre commande a été modifié: ' . $this->commande->statut,
            'url' => '/commandes/' . $this->commande->id,
        ];
    }
}
