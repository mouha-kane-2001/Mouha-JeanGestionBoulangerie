import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface AIMessage {
  id?: number;
  content: string;
  sender: 'client' | 'agent' | 'system';
  senderName?: string;
  timestamp: Date;
  isAI?: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class OpenAIChatService {
constructor(private http: HttpClient) {}

  generateSuggestion(userQuestion: string): Observable<any> {
    return this.http.post('http://localhost:8000/api/openai-chat', { question: userQuestion });
  }

 extractSuggestionFromResponse(response: any): string {
  console.log('Réponse complète du backend :', response);
  return response.choices?.[0]?.message?.content?.trim() || 'Aucune suggestion disponible';
}

  getPredefinedSuggestions(): string[] {
    return [
      'Quels sont vos horaires d\'ouverture ?',
      'Proposez-vous des options sans gluten ?',
      'Quels sont vos prix pour les gâteaux d\'anniversaire ?',
      'Avez-vous des produits bio ?'
    ];
  }
}
