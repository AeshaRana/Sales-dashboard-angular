import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomersService } from '../../core/services/customers';
import { OrdersServices } from '../../core/services/orders';
import { ProductsService } from '../../core/services/products';

@Component({
  selector: 'app-add-order',
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './add-order.html',
  styleUrl: './add-order.css',
})
export class AddOrder implements OnInit {
  maxDate = new Date().toISOString().split('T')[0];

  customerService = inject(CustomersService);
  productService = inject(ProductsService);
  ordersService = inject(OrdersServices);
  customers$ = this.customerService.customers$;
  products$ = this.productService.products$;

  private router = inject(Router);

  statusList = [
    { id: 1, status: 'completed' },
    { id: 2, status: 'pending' },
    { id: 3, status: 'cancelled' },
  ];

  Orderform = new FormGroup({
    onum: new FormControl('', {
      validators: [Validators.required, Validators.min(1)],
    }),
    cid: new FormControl('', {
      validators: [Validators.required],
    }),
    pid: new FormControl('', {
      validators: [Validators.required],
    }),
    odate: new FormControl('', {
      validators: [Validators.required],
    }),
    oamount: new FormControl('', {
      validators: [Validators.required, Validators.min(1)],
    }),
    ostatus: new FormControl('', {
      validators: [Validators.required],
    }),
  });

  ngOnInit(): void {
    this.customerService.loadCustomers();
    this.productService.loadProducts();
  }

  onSubmit() {
    if (this.Orderform.invalid) {
      this.Orderform.markAllAsTouched();
      return;
    }

    this.ordersService.addOrder({
      onum: String(this.Orderform.value.onum ?? ''),
      cid: String(this.Orderform.value.cid ?? ''),
      pid: String(this.Orderform.value.pid ?? ''),
      odate: String(this.Orderform.value.odate ?? ''),
      oamount: String(this.Orderform.value.oamount ?? ''),
      ostatus: String(this.Orderform.value.ostatus ?? ''),
    });

    this.Orderform.reset();
    this.router.navigate(['/orders']);
  }
}
