import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ticketboard } from './ticketboard';

describe('Ticketboard', () => {
  let component: Ticketboard;
  let fixture: ComponentFixture<Ticketboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ticketboard],
    }).compileComponents();

    fixture = TestBed.createComponent(Ticketboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
