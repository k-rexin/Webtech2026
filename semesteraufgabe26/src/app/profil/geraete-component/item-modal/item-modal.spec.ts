import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemModal } from './item-modal';

describe('ItemModal', () => {
  let component: ItemModal;
  let fixture: ComponentFixture<ItemModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemModal],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
