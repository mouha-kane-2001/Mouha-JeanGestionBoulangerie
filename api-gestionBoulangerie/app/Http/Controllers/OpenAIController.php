<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class OpenAIController extends Controller
{
  public function chat(Request $request)
    {
        $userQuestion = $request->input('question');

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . env('OPENAI_API_KEY'),
            'Content-Type' => 'application/json',
        ])->post('https://api.openai.com/v1/chat/completions', [
            'model' => 'gpt-3.5-turbo',
            'messages' => [
                ['role' => 'system', 'content' => 'Tu es un assistant de support pour une boulangerie. Réponds uniquement avec des suggestions courtes et professionnelles.'],
                ['role' => 'user', 'content' => $userQuestion]
            ],
            'max_tokens' => 100
        ]);

        return $response->json();
    }

}
