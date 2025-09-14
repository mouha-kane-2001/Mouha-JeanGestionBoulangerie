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
        Schema::create('promotions', function (Blueprint $table) {

            $table->id();
            $table->string('nom');
            $table->text('description')->nullable();
            $table->enum('type_reduction', ['pourcentage', 'montant'])->default('pourcentage');
            $table->decimal('valeur_reduction', 10, 2);
            $table->dateTime('date_debut');
            $table->dateTime('date_fin');
            $table->foreignId('categorie_id')->nullable()->constrained()->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promotions');
    }
};
