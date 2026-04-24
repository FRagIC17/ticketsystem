import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Faqpage } from './faqpage';

describe('Faqpage', () => {
  let component: Faqpage;
  let fixture: ComponentFixture<Faqpage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Faqpage],
    }).compileComponents();

    fixture = TestBed.createComponent(Faqpage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
