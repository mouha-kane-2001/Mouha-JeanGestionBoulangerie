<?php

namespace App\Notifications;

use App\Models\Commande;
use App\Models\Facture;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class FactureGeneree extends Notification implements ShouldQueue
{
    use Queueable;

    public $commande;
    public $facture;

    /**
     * Create a new notification instance.
     */
    public function __construct(Commande $commande, Facture $facture)
    {
        $this->commande = $commande;
        $this->facture = $facture;
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
            ->subject('Votre facture est disponible')
            ->line('La facture pour votre commande n°' . $this->commande->id . ' est maintenant disponible.')
            ->line('Numéro de facture: ' . $this->facture->numero_facture)
            ->line('Montant total: ' . number_format($this->facture->montant_total, 2) . ' €')
            ->action('Télécharger la facture', url('/factures/' . $this->facture->id . '/download'))
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
            'facture_id' => $this->facture->id,
            'message' => 'Votre facture n°' . $this->facture->numero_facture . ' est disponible.',
            'url' => '/factures/' . $this->facture->id . '/download',
        ];
    }
}
