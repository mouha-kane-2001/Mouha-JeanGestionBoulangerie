<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('factures', function (Blueprint $table) {
            $table->id();
            $table->foreignId('commande_id')->constrained('commandes')->onDelete('cascade');
            $table->string('numero_facture')->unique();
                $table->enum('statut', ['non_payee', 'payee', 'annulee'])->default('non_payee');
            $table->date('date_emission');
                        $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Ajout user_id

            $table->decimal('montant_total', 10, 2);
            $table->string('pdf_path')->nullable(); // chemin vers le PDF
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('factures');
    }
};
