import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductData } from '../../Orders/order.data';
import { ProductsService } from '../../core/services/products';

@Component({
  selector: 'app-product.component.ts',
  imports: [ReactiveFormsModule],
  templateUrl: './product.component.ts.html',
  styleUrl: './product.component.ts.css',
})
export class ProductComponentTs implements OnInit {
  products: ProductData[] = [];
  isUpdated = signal(false);

  private destroyRef = inject(DestroyRef);

  constructor(
    private router: Router,
    private productsService: ProductsService,
  ) {}

  ngOnInit(): void {
    this.productsService.loadProducts();
    this.productsService.products$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((products) => {
        this.products = products;
      });
  }

  addProduct() {
    this.router.navigate(['product/add']);
  }

  onUpdate() {}

  onDelete(pid: string) {
    const isDelete = confirm('Are you sure you want to delete this product');
    if (isDelete) {
      this.productsService.deleteProduct(pid);
    }
  }
}
