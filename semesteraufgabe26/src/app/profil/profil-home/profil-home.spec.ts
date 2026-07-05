import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilHome } from './profil-home';

describe('ProfilHome', () => {
  let component: ProfilHome;
  let fixture: ComponentFixture<ProfilHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilHome],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
