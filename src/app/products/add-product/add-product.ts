import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsService } from '../../core/services/products';

@Component({
  selector: 'app-add-product',
  imports: [ReactiveFormsModule],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css',
})
export class AddProduct {
  constructor(
    private router: Router,
    private productsService: ProductsService,
  ) {}

  productCategory = [
    { id: 1, category: 'Electronic' },
    { id: 2, category: 'Clothing' },
    { id: 3, category: 'Grocery' },
    { id: 4, category: 'Others' },
  ];

  productForm = new FormGroup({
    pname: new FormControl('', {
      validators: [Validators.required],
    }),
    pprice: new FormControl('', {
      validators: [Validators.required, Validators.min(1)],
    }),
    ptitle: new FormControl('', {
      validators: [Validators.required],
    }),
    pdescription: new FormControl('', {
      validators: [Validators.required],
    }),
    pcategory: new FormControl('', {
      validators: [Validators.required],
    }),
  });

  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.productsService.addProduct({
      pname: String(this.productForm.value.pname ?? '').trim(),
      ptitle: String(this.productForm.value.ptitle ?? '').trim(),
      pcategory: String(this.productForm.value.pcategory ?? ''),
      pprice: Number(this.productForm.value.pprice ?? 0),
      pdescription: String(this.productForm.value.pdescription ?? '').trim(),
    });

    this.productForm.reset();
    this.router.navigate(['/product']);
  }
}
