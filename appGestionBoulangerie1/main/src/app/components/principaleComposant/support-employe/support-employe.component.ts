import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { SupportService } from 'src/app/services/support.service';


@Component({
  selector: 'app-support-employe',
  standalone: true,
  imports: [CommonModule, FormsModule, MatListModule, MatBadgeModule, MatIconModule, MatButtonModule, DatePipe],
   templateUrl: './support-employe.component.html',
  styleUrls: ['./support-employe.component.scss']
})
export class SupportEmployeComponent implements OnInit {
  conversations: any[] = [];
  messages: any[] = [];
  selectedConversationId: number | null = null;
  nouveauMessage: string = '';

  constructor(private supportService: SupportService) {}

  ngOnInit(): void {
    this.loadConversations();
  }

  loadConversations(): void {
    this.supportService.getConversationsEmploye().subscribe({
      next: data => this.conversations = data,
      error: err => console.error(err)
    });
  }

  selectConversation(conversationId: number): void {
    this.selectedConversationId = conversationId;
    this.loadMessages(conversationId);
  }

  loadMessages(conversationId: number): void {
    this.supportService.getMessagesEmploye(conversationId).subscribe({
      next: data => this.messages = data,
      error: err => console.error(err)
    });
  }

  envoyerMessage(): void {
    if (!this.nouveauMessage || !this.selectedConversationId) return;

    this.supportService.sendMessageEmploye(this.selectedConversationId, this.nouveauMessage).subscribe({
      next: () => {
        this.nouveauMessage = '';
        this.loadMessages(this.selectedConversationId!);
      },
      error: err => console.error(err)
    });
  }
}
 