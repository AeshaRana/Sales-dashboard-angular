import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductComponentTs } from './product.component.ts';

describe('ProductComponentTs', () => {
  let component: ProductComponentTs;
  let fixture: ComponentFixture<ProductComponentTs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductComponentTs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductComponentTs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
