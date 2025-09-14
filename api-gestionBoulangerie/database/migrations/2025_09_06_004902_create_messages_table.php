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
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
             $table->foreignId('conversation_id')
                  ->constrained('conversations')
                  ->onDelete('cascade');

            // Qui a écrit le message (null si système/IA)
            $table->foreignId('user_id')
                  ->nullable()
                  ->constrained('users')
                  ->onDelete('cascade');

            // Type du message : client, employé ou system (IA)
            $table->enum('type', ['client', 'employe', 'system'])->default('client');

            // Contenu du message
            $table->text('contenu');

            // Date de lecture du message (nullable)
            $table->timestamp('lu_le')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
