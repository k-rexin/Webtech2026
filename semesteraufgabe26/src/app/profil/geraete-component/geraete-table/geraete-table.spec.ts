import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeraeteTable } from './geraete-table';

describe('GeraeteTable', () => {
  let component: GeraeteTable;
  let fixture: ComponentFixture<GeraeteTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeraeteTable],
    }).compileComponents();

    fixture = TestBed.createComponent(GeraeteTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
