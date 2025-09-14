<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;

 use App\Models\Conversation;
use App\Models\Message;
 use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function listConversations(Request $request)
    {
        $client = $request->user();

        $conversations = Conversation::with(['messages' => function ($q) {
            $q->orderBy('created_at', 'asc');
        }])
        ->where('user_id', $client->id)
        ->orderBy('updated_at', 'desc')
        ->get();

        return response()->json($conversations, 200);
    }

    /**
     * Crée une nouvelle conversation
     */
    public function createConversation(Request $request)
    {
        $client = $request->user();

        $validator = Validator::make($request->all(), [
            'sujet' => 'required|string|max:255',
            'message_initial' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Création de la conversation
        $conversation = Conversation::create([
            'user_id' => $client->id,
            'sujet' => $request->sujet,
            'statut' => 'ouvert',
        ]);

        // Ajout du premier message
        $message = Message::create([
            'conversation_id' => $conversation->id,
            'user_id' => $client->id,
            'type' => 'client',
            'contenu' => $request->message_initial,
        ]);

        return response()->json([
            'conversation' => $conversation->load('messages')
        ], 201);
    }

    /**
     * Récupère les messages d'une conversation spécifique
     */
    public function getMessages($id, Request $request)
    {
        $client = $request->user();

        $conversation = Conversation::with('messages')
            ->where('id', $id)
            ->where('user_id', $client->id)
            ->first();

        if (!$conversation) {
            return response()->json(['message' => 'Conversation non trouvée'], 404);
        }

        return response()->json($conversation->messages, 200);
    }

    /**
     * Envoie un message dans une conversation
     */
    public function sendMessage($id, Request $request)
    {
        $client = $request->user();

        $conversation = Conversation::where('id', $id)
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
}
