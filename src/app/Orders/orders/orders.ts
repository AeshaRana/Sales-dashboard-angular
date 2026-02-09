import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerData, OrderDetail, ProductData } from '../order.data';
import { CustomersService } from '../../core/services/customers';
import { OrdersServices } from '../../core/services/orders';
import { ProductsService } from '../../core/services/products';

@Component({
  selector: 'app-orders',
  imports: [DatePipe, ReactiveFormsModule, AsyncPipe],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders implements OnInit {
  orders: OrderDetail[] = [];
  editingId: string | null = null;
  isUpdating = signal(false);
  editingForm!: FormGroup;
  maxDate = new Date().toISOString().split('T')[0];
  private customerService = inject(CustomersService);
  private productService = inject(ProductsService);
  customers$ = this.customerService.customers$;
  products$ = this.productService.products$;
  customers: CustomerData[] = [];
  products: ProductData[] = [];

  private destroyRef = inject(DestroyRef);

  constructor(
    private router: Router,
    private formBuider: FormBuilder,
    private ordersService: OrdersServices,
  ) {}

  ngOnInit(): void {
    this.customerService.loadCustomers();
    this.productService.loadProducts();
    this.ordersService.loadOrders();

    this.customerService.customers$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((customers) => {
        this.customers = customers;
      });

    this.productService.products$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((products) => {
        this.products = products;
      });

    this.ordersService.orders$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((orders) => {
        this.orders = orders;
      });
  }

  addOrder() {
    this.router.navigate(['orders/add']);
  }

  onDelete(id: string) {
    const isDelete = confirm('Are you sure you want to delete this order');
    if (isDelete) {
      this.ordersService.deleteOrder(id);
    }
  }

  onUpdate(order: OrderDetail) {
    this.editingId = order.id;
    this.isUpdating.set(true);

    this.editingForm = this.formBuider.group({
      id: [order.id],
      onum: [order.onum],
      cid: [order.cid],
      pid: [order.pid],
      oamount: [order.oamount],
      ostatus: [order.ostatus],
      odate: [order.odate],
    });
  }

  onSave(item: OrderDetail) {
    const data = this.editingForm.value;
    const updated: OrderDetail = {
      id: item.id,
      onum: String(data.onum ?? ''),
      cid: String(data.cid ?? ''),
      pid: String(data.pid ?? ''),
      odate: String(data.odate ?? ''),
      oamount: String(data.oamount ?? ''),
      ostatus: String(data.ostatus ?? ''),
    };

    this.ordersService.updateOrder(updated);
    this.isUpdating.set(false);
    this.editingId = null;
  }

  getCustomerLabel(customerId: string): string {
    const matched = this.customerService.getCustomerById(customerId);
    if (!matched) {
      return customerId;
    }

    return `${matched.firstName} ${matched.lastName}`;
  }

  getProductLabel(productId: string): string {
    if (!productId) {
      return 'Not set';
    }

    const matched = this.productService.getProductById(productId);
    if (!matched) {
      return productId;
    }

    return matched.pname;
  }
}
