import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Knowledgebase } from './knowledgebase';

describe('Knowledgebase', () => {
  let component: Knowledgebase;
  let fixture: ComponentFixture<Knowledgebase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Knowledgebase],
    }).compileComponents();

    fixture = TestBed.createComponent(Knowledgebase);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
