import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Card } from '../card/card';
import { OrdersServices } from '../../core/services/orders';

@Component({
  selector: 'app-cards',
  imports: [Card],
  templateUrl: './cards.html',
  styleUrl: './cards.css',
})
export class Cards {
  private service = inject(OrdersServices);

  totalRevenue = toSignal(this.service.totalRevenue$, { initialValue: 0 });
  orderCount = toSignal(this.service.totalOrderCount$, { initialValue: 0 });
  customerCount = toSignal(this.service.totalCustomerCount$, { initialValue: 0 });

  cards = computed(() => [
    {
      id: 1,
      title: 'Total Revenue',
      change: '+12.4%',
      value: `${this.totalRevenue()}`,
    },
    {
      id: 2,
      title: 'Total Orders',
      change: '-3.1%',
      value: `${this.orderCount()}`,
    },
    {
      id: 3,
      title: 'Total Customers',
      change: '+8.7%',
      value: `${this.customerCount()}`,
    },
    {
      id: 4,
      title: 'Growth Rate',
      change: '+4.5%',
      value: '18.2%',
    },
  ]);
}
