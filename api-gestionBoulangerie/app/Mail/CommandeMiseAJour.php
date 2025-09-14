<?php

namespace App\Mail;

use App\Models\Commande;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CommandeMiseAJour extends Mailable
{
    use Queueable, SerializesModels;

    public $commande;
    public $modifications;

    public function __construct(Commande $commande, array $modifications = [])
    {
        $this->commande = $commande;
        $this->modifications = $modifications;
    }

    public function build()
    {
        return $this->subject('Mise à jour de votre commande #' . $this->commande->id)
                    ->markdown('emails.commande-mise-a-jour')
                    ->with([
                        'commande' => $this->commande,
                        'modifications' => $this->modifications
                    ]);
    }
}
