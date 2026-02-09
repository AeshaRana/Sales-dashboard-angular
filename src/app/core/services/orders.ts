import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CustomerData, OrderDetail } from '../../Orders/order.data';
import { CustomersService } from './customers';

@Injectable({
  providedIn: 'root',
})
export class OrdersServices {
  private static readonly ORDERS_KEY = 'orderData';
  private static readonly ORDER_ID_KEY = 'orderCount';

  private ordersSubject = new BehaviorSubject<OrderDetail[]>(this.readOrders());
  orders$ = this.ordersSubject.asObservable();

  private totalAmount$ = new BehaviorSubject<number>(0);
  private totalOrders$ = new BehaviorSubject<number>(0);
  private totalCustomers$ = new BehaviorSubject<number>(0);

  totalRevenue$ = this.totalAmount$.asObservable();
  totalOrderCount$ = this.totalOrders$.asObservable();
  totalCustomerCount$ = this.totalCustomers$.asObservable();

  constructor(private customersService: CustomersService) {
    this.refreshMetrics();

    this.customersService.customers$.subscribe(() => {
      this.refreshMetrics();
    });
  }

  loadOrders(): void {
    this.ordersSubject.next(this.readOrders());
    this.refreshMetrics();
  }

  getOrdersSnapshot(): OrderDetail[] {
    return this.ordersSubject.value;
  }

  addOrder(payload: Omit<OrderDetail, 'id'>): OrderDetail {
    const order: OrderDetail = {
      id: String(this.getNextOrderId()),
      ...payload,
    };

    this.persistOrders([...this.ordersSubject.value, order]);
    return order;
  }

  updateOrder(order: OrderDetail): void {
    const updated = this.ordersSubject.value.map((item) =>
      item.id === order.id ? order : item,
    );
    this.persistOrders(updated);
  }

  deleteOrder(id: string): void {
    const filtered = this.ordersSubject.value.filter((order) => order.id !== id);
    this.persistOrders(filtered);
  }

  private readOrders(): OrderDetail[] {
    const raw = localStorage.getItem(OrdersServices.ORDERS_KEY);
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw) as Partial<OrderDetail>[];
      return parsed.map((order) => ({
        id: String(order.id ?? ''),
        onum: String(order.onum ?? ''),
        cid: String(order.cid ?? ''),
        pid: String(order.pid ?? ''),
        odate: String(order.odate ?? ''),
        oamount: String(order.oamount ?? ''),
        ostatus: String(order.ostatus ?? ''),
      }));
    } catch {
      return [];
    }
  }

  private persistOrders(orders: OrderDetail[]): void {
    localStorage.setItem(OrdersServices.ORDERS_KEY, JSON.stringify(orders));
    this.ordersSubject.next(orders);
    this.refreshMetrics();
  }

  private refreshMetrics(): void {
    const orders = this.ordersSubject.value;
    const customers: CustomerData[] = this.customersService.getCustomersSnapshot();

    const revenue = orders.reduce((sum, order) => {
      const isCompleted = order.ostatus?.toLowerCase() === 'completed';
      if (!isCompleted) {
        return sum;
      }

      const amount = Number(order.oamount);
      return Number.isFinite(amount) ? sum + amount : sum;
    }, 0);

    this.totalAmount$.next(revenue);
    this.totalOrders$.next(orders.length);
    this.totalCustomers$.next(customers.length);
  }

  private getNextOrderId(): number {
    const currentId = Number(localStorage.getItem(OrdersServices.ORDER_ID_KEY) ?? 0);
    const maxExisting = this.ordersSubject.value.reduce((max, order) => {
      const parsedId = Number(order.id);
      return Number.isFinite(parsedId) && parsedId > max ? parsedId : max;
    }, 0);

    const nextId = Math.max(currentId, maxExisting) + 1;
    localStorage.setItem(OrdersServices.ORDER_ID_KEY, String(nextId));
    return nextId;
  }
}
