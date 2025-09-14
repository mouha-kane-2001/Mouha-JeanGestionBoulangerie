import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


export interface Conversation {
  id: number;
  sujet?: string;
  dernier_message?: string;
  updated_at?: string;
  non_lu_count?: number;
}

export interface Message {
  id?: number;
  conversation_id: number;
  user_id?: number;
  contenu: string;
  created_at?: string;
  auteur?: 'client' | 'support';
}
@Injectable({
  providedIn: 'root'
})
export class SupportService {

   private apiUrl = 'http://localhost:8000/api/client/support';

  constructor(private http: HttpClient) { }

  // Lister les conversations du client
  getConversations(): Observable<any> {
    return this.http.get(`${this.apiUrl}/conversations`);
  }

  // Créer une nouvelle conversation
  createConversation(sujet: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/conversationsCreer`, { sujet });
  }

  // Récupérer les messages d'une conversation
  getMessages(conversationId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/conversations/${conversationId}/messages`);
  }

  // Envoyer un message dans une conversation
  sendMessage(conversationId: number, contenu: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/conversations/${conversationId}/messages`, { contenu });
  }














  getConversationsEmploye() {
    return this.http.get<any[]>('http://localhost:8000/api/employe/support/conversations');
}

getMessagesEmploye(conversationId: number) {
    return this.http.get<any[]>(`http://localhost:8000/api/employe/support/conversations/${conversationId}/messages`);
}

sendMessageEmploye(conversationId: number, contenu: string) {
    return this.http.post<any>(`http://localhost:8000/api/employe/support/conversations/${conversationId}/messages`, { contenu });
}
}
