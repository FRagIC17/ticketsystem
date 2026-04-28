import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Createticket } from './createticket';

describe('Createticket', () => {
  let component: Createticket;
  let fixture: ComponentFixture<Createticket>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Createticket],
    }).compileComponents();

    fixture = TestBed.createComponent(Createticket);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
