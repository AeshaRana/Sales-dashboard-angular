import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesByRegion } from './sales-by-region';

describe('SalesByRegion', () => {
  let component: SalesByRegion;
  let fixture: ComponentFixture<SalesByRegion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesByRegion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesByRegion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
