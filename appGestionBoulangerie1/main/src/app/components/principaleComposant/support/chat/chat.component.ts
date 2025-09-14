import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { OpenAIChatService } from 'src/app/services/open-aichat.service';
import { Message, SupportService } from 'src/app/services/support.service';
interface ChatMessage {
  content: string;
  sender: 'client' | 'assistant';
  timestamp: Date;
  isSuggestion?: boolean;
}
@Component({
  selector: 'app-chat',
   imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    DatePipe
  ] ,
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent     {

  @ViewChild('messageContainer', { static: false }) private messageContainer!: ElementRef;

  messages: ChatMessage[] = [];
  newMessage: string = '';
  isGeneratingSuggestion: boolean = false;
  showPredefinedSuggestions: boolean = true;

  constructor(private suggestionService: OpenAIChatService) {
    this.messages.push({
      content: 'Bonjour ! Posez-moi une question sur notre boulangerie et je vous proposerai des suggestions.',
      sender: 'assistant',
      timestamp: new Date()
    });
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;

    const clientMessage: ChatMessage = {
      content: this.newMessage,
      sender: 'client',
      timestamp: new Date()
    };

    this.messages.push(clientMessage);
    this.newMessage = '';
    this.showPredefinedSuggestions = false;
    this.isGeneratingSuggestion = true;
    this.scrollToBottom();

    this.suggestionService.generateSuggestion(clientMessage.content).subscribe({
      next: (response: any) => {
        const suggestion = this.suggestionService.extractSuggestionFromResponse(response);

        this.messages.push({
          content: suggestion,
          sender: 'assistant',
          timestamp: new Date(),
          isSuggestion: true
        });

        this.isGeneratingSuggestion = false;
        this.scrollToBottom();
      },
      error: () => {
        this.messages.push({
          content: 'Désolé, je ne peux pas générer de suggestion pour le moment.',
          sender: 'assistant',
          timestamp: new Date()
        });
        this.isGeneratingSuggestion = false;
        this.scrollToBottom();
      }
    });
  }

  selectPredefinedSuggestion(suggestion: string): void {
    this.newMessage = suggestion;
    this.sendMessage();
  }

  getPredefinedSuggestions(): string[] {
    return this.suggestionService.getPredefinedSuggestions();
  }

  resetConversation(): void {
    this.messages = [{
      content: 'Bonjour ! Posez-moi une question sur notre boulangerie et je vous proposerai des suggestions.',
      sender: 'assistant',
      timestamp: new Date()
    }];
    this.showPredefinedSuggestions = true;
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.messageContainer) {
        this.messageContainer.nativeElement.scrollTop =
          this.messageContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }
}
