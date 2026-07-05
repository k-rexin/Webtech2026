import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeraeteInhalt } from './geraete-inhalt';

describe('GeraeteInhalt', () => {
  let component: GeraeteInhalt;
  let fixture: ComponentFixture<GeraeteInhalt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeraeteInhalt],
    }).compileComponents();

    fixture = TestBed.createComponent(GeraeteInhalt);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
