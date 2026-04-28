import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Selectedticket } from './selectedticket';

describe('Selectedticket', () => {
  let component: Selectedticket;
  let fixture: ComponentFixture<Selectedticket>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Selectedticket],
    }).compileComponents();

    fixture = TestBed.createComponent(Selectedticket);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
