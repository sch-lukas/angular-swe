import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Suche } from './suche';

describe('Suche', () => {
  let component: Suche;
  let fixture: ComponentFixture<Suche>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Suche]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Suche);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
