<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Support\Facades\Validator;

class SupportController extends Controller
{
     /**
     * Lister toutes les conversations du client connecté
     */
    public function listConversations(Request $request)
    {
        $client = $request->user();

        $conversations = Conversation::with('user', 'messages.user')
                            ->where('user_id', $client->id)
                            ->orderBy('created_at', 'desc')
                            ->get();

        return response()->json($conversations, 200);
    }

    /**
     * Créer une nouvelle conversation
     */
    public function createConversation(Request $request)
    {
        $client = $request->user();

        $validator = Validator::make($request->all(), [
            'sujet' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $conversation = Conversation::create([
            'user_id' => $client->id,
            'sujet' => $request->sujet,
            'statut' => 'ouvert',
        ]);

        return response()->json($conversation, 201);
    }

    /**
     * Lister les messages d’une conversation
     */




    public function sendMessage($conversationId, Request $request)
{
    $client = $request->user();

    $conversation = Conversation::where('id', $conversationId)
        ->where('user_id', $client->id)
        ->first();

    if (!$conversation) {
        return response()->json(['message' => 'Conversation non trouvée'], 404);
    }

    $validator = Validator::make($request->all(), [
        'contenu' => 'required|string',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    $message = Message::create([
        'conversation_id' => $conversation->id,
        'user_id' => $client->id,
        'type' => 'client',
        'contenu' => $request->contenu,
    ]);

    return response()->json($message, 201);
}

    public function getMessages($conversationId, Request $request)
    {
        $client = $request->user();

        $conversation = Conversation::with('messages.user')
                            ->where('id', $conversationId)
                            ->where('user_id', $client->id)
                            ->first();

        if (!$conversation) {
            return response()->json(['message' => 'Conversation non trouvée'], 404);
        }

        return response()->json($conversation->messages, 200);
    }


















public function listConversationsEmploye()
    {
        $conversations = Conversation::with('messages.user', 'user')
                            ->where('statut', 'ouvert')
                            ->orderBy('created_at', 'desc')
                            ->get();

        return response()->json($conversations, 200);
    }

    // Lister les messages d’une conversation
    public function getMessagesEmploye($conversationId)
    {
        $conversation = Conversation::with('messages.user')
                            ->where('id', $conversationId)
                            ->first();

        if (!$conversation) {
            return response()->json(['message' => 'Conversation non trouvée'], 404);
        }

        return response()->json($conversation->messages, 200);
    }

    // Envoyer un message dans une conversation
    public function sendMessageEmploye($conversationId, Request $request)
    {
        $validator = Validator::make($request->all(), [
            'contenu' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $conversation = Conversation::find($conversationId);
        if (!$conversation) {
            return response()->json(['message' => 'Conversation non trouvée'], 404);
        }

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'user_id' =>  $request->user()->id, // l'employé connecté
            'type' => 'employe',
            'contenu' => $request->contenu
        ]);

        return response()->json($message, 201);
    }



}
