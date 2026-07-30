import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeraeteComponent } from './geraeteComponent';

describe('GeraeteComponent', () => {
  let component: GeraeteComponent;
  let fixture: ComponentFixture<GeraeteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeraeteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GeraeteComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
