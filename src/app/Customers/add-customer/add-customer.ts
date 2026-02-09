import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomersService } from '../../core/services/customers';

@Component({
  selector: 'app-add-customer',
  imports: [ReactiveFormsModule],
  templateUrl: './add-customer.html',
  styleUrl: './add-customer.css',
})
export class AddCustomer {
  constructor(
    private router: Router,
    private customersService: CustomersService,
  ) {}

  customerForm = new FormGroup({
    firstName: new FormControl('', {
      validators: [Validators.required],
    }),
    lastName: new FormControl('', {
      validators: [Validators.required],
    }),
    emailId: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    phoneNumber: new FormControl('', {
      validators: [Validators.required, Validators.minLength(10)],
    }),
    address: new FormControl('', {
      validators: [Validators.required],
    }),
  });

  onSubmit(): void {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }

    this.customersService.addCustomer({
      firstName: String(this.customerForm.value.firstName ?? '').trim(),
      lastName: String(this.customerForm.value.lastName ?? '').trim(),
      emailId: String(this.customerForm.value.emailId ?? '').trim(),
      phoneNumber: String(this.customerForm.value.phoneNumber ?? '').trim(),
      address: String(this.customerForm.value.address ?? '').trim(),
    });

    this.customerForm.reset();
    this.router.navigate(['/customers']);
  }
}
