import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CustomerData } from '../../Orders/order.data';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  private static readonly CUSTOMERS_KEY = 'customerData';
  private static readonly CUSTOMER_ID_KEY = 'customerId';

  private customersSubject = new BehaviorSubject<CustomerData[]>(this.readCustomers());
  customers$ = this.customersSubject.asObservable();

  loadCustomers(): void {
    this.customersSubject.next(this.readCustomers());
  }

  getCustomersSnapshot(): CustomerData[] {
    return this.customersSubject.value;
  }

  getCustomerById(id: string): CustomerData | undefined {
    return this.customersSubject.value.find(
      (customer) => String(customer.id) === String(id),
    );
  }

  addCustomer(payload: Omit<CustomerData, 'id'>): CustomerData {
    const customer: CustomerData = {
      id: String(this.getNextCustomerId()),
      ...payload,
    };

    this.persistCustomers([...this.customersSubject.value, customer]);
    return customer;
  }

  updateCustomer(customer: CustomerData): void {
    const updated = this.customersSubject.value.map((item) =>
      item.id === customer.id ? customer : item,
    );
    this.persistCustomers(updated);
  }

  deleteCustomer(id: string): void {
    const filtered = this.customersSubject.value.filter((customer) => customer.id !== id);
    this.persistCustomers(filtered);
  }

  private readCustomers(): CustomerData[] {
    const raw = localStorage.getItem(CustomersService.CUSTOMERS_KEY);
    if (!raw) {
      return [];
    }

    try {
      return JSON.parse(raw) as CustomerData[];
    } catch {
      return [];
    }
  }

  private persistCustomers(customers: CustomerData[]): void {
    localStorage.setItem(CustomersService.CUSTOMERS_KEY, JSON.stringify(customers));
    this.customersSubject.next(customers);
  }

  private getNextCustomerId(): number {
    const currentId = Number(localStorage.getItem(CustomersService.CUSTOMER_ID_KEY) ?? 0);
    const maxExisting = this.customersSubject.value.reduce((max, customer) => {
      const parsedId = Number(customer.id);
      return Number.isFinite(parsedId) && parsedId > max ? parsedId : max;
    }, 0);

    const nextId = Math.max(currentId, maxExisting) + 1;
    localStorage.setItem(CustomersService.CUSTOMER_ID_KEY, String(nextId));
    return nextId;
  }
}
