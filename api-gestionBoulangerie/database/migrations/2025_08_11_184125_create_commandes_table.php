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
        Schema::create('commandes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('mode_paiement', ['en_ligne', 'a_la_livraison', 'espece']);
            $table->enum('statut', ['en_attente','en_preparation', 'prete', 'en_livraison', 'livree','annulee'])->default('en_preparation');
            $table->text('notes')->nullable();
            $table->decimal('total', 10, 2);

            // Champs manquants pour la livraison
            $table->string('statut_livraison')->default('en_attente');
            $table->string('numero_suivi')->nullable();
            $table->string('transporteur')->nullable();
            $table->timestamp('estimation_livraison')->nullable();
            $table->timestamp('date_livraison')->nullable();
            $table->text('adresse_livraison')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('commandes');
    }
};
