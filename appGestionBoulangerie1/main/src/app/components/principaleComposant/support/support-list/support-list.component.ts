import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { Router, RouterModule } from '@angular/router';
import { Conversation, SupportService } from 'src/app/services/support.service';

@Component({
  selector: 'app-support-list',
standalone: true,
  imports: [CommonModule, RouterModule,  FormsModule, MatListModule, MatBadgeModule, MatIconModule, MatButtonModule, DatePipe, FormsModule,MatFormFieldModule,   // ✅ ajouté
    MatInputModule,           // pour ngModel
    ReactiveFormsModule, ],
  templateUrl: './support-list.component.html',
  styleUrls: ['./support-list.component.scss']
})
export class SupportListComponent  implements OnInit {
  conversations: any[] = [];
  selectedConversation: any = null;
  messages: any[] = [];
  newMessage: string = '';
  newSujet: string = '';

  constructor(private supportService: SupportService) {}

  ngOnInit(): void {
    this.loadConversations();
  }

  loadConversations() {
  this.supportService.getConversations().subscribe((data: any[]) => {
    this.conversations = data.map((conv: any) => ({
      ...conv,
      user: conv.user || { prenom: 'Inconnu', nom: 'Utilisateur' }
    }));
     console.log("✅ Conversations après mapping :", this.conversations);
  });
}

  createConversation() {
    if (!this.newSujet.trim()) return;
    this.supportService.createConversation(this.newSujet).subscribe(conv => {
      this.conversations.push(conv);
      this.newSujet = '';
    });
  }

  openConversation(conv: any) {
    this.selectedConversation = conv;
    this.supportService.getMessages(conv.id).subscribe(msgs => {
      this.messages = msgs;
    });
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.selectedConversation) return;
    this.supportService.sendMessage(this.selectedConversation.id, this.newMessage).subscribe(msg => {
      this.messages.push(msg);
      this.newMessage = '';
    });
  }
}
