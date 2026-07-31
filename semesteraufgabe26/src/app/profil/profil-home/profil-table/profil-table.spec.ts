import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilTable } from './profil-table';

describe('ProfilTable', () => {
  let component: ProfilTable;
  let fixture: ComponentFixture<ProfilTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilTable],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
