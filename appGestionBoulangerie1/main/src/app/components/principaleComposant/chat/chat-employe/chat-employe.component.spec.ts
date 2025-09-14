import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatEmployeComponent } from './chat-employe.component';

describe('ChatEmployeComponent', () => {
  let component: ChatEmployeComponent;
  let fixture: ComponentFixture<ChatEmployeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatEmployeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatEmployeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
