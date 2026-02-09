import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CustomerData } from '../../Orders/order.data';
import { CustomersService } from '../../core/services/customers';

@Component({
  selector: 'app-customers',
  imports: [ReactiveFormsModule],
  templateUrl: './customers.html',
  styleUrl: './customers.css',
})
export class Customers implements OnInit {
  customer: CustomerData[] = [];
  isUpdated = signal(false);
  editingId: string | null = null;
  editingForm!: FormGroup;
  totalCustomer = signal(0);

  private destroyRef = inject(DestroyRef);

  constructor(
    private route: Router,
    private formBuider: FormBuilder,
    private customersService: CustomersService,
  ) {}

  ngOnInit(): void {
    this.customersService.loadCustomers();

    this.customersService.customers$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((customers) => {
        this.customer = customers;
        this.totalCustomer.set(customers.length);
      });
  }

  addCustomer() {
    this.route.navigate(['customers/add']);
  }

  onDelete(id: string) {
    const isDelete = confirm('Are you sure you want to delete this customer');
    if (isDelete) {
      this.customersService.deleteCustomer(id);
    }
  }

  onUpdate(customer: CustomerData) {
    this.editingId = customer.id;
    this.isUpdated.set(true);

    this.editingForm = this.formBuider.group({
      id: [customer.id],
      firstName: [customer.firstName, [Validators.required]],
      lastName: [customer.lastName, [Validators.required]],
      emailId: [customer.emailId, [Validators.required, Validators.email]],
      phoneNumber: [customer.phoneNumber, [Validators.required, Validators.minLength(10)]],
      address: [customer.address, [Validators.required]],
    });
  }

  onSave(customer: CustomerData) {
    if (this.editingForm.invalid) {
      this.editingForm.markAllAsTouched();
      return;
    }

    const updatedCustomer: CustomerData = {
      id: customer.id,
      firstName: String(this.editingForm.value.firstName ?? '').trim(),
      lastName: String(this.editingForm.value.lastName ?? '').trim(),
      emailId: String(this.editingForm.value.emailId ?? '').trim(),
      phoneNumber: String(this.editingForm.value.phoneNumber ?? '').trim(),
      address: String(this.editingForm.value.address ?? '').trim(),
    };

    this.customersService.updateCustomer(updatedCustomer);
    this.isUpdated.set(false);
    this.editingId = null;
  }
}
