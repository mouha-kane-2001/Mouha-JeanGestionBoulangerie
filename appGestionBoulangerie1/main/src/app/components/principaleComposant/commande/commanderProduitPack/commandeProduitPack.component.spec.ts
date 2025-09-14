import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandeProduitPackComponent } from './commandeProduitPack.component';

describe('CommandeFormComponent', () => {
  let component: CommandeProduitPackComponent;
  let fixture: ComponentFixture<CommandeProduitPackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandeProduitPackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommandeProduitPackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
