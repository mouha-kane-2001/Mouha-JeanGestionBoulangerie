import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatRoomComponentComponent } from './chat-room-component.component';

describe('ChatRoomComponentComponent', () => {
  let component: ChatRoomComponentComponent;
  let fixture: ComponentFixture<ChatRoomComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatRoomComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatRoomComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
