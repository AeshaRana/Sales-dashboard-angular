import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProductData } from '../../Orders/order.data';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private static readonly PRODUCTS_KEY = 'productData';
  private static readonly PRODUCT_ID_KEY = 'productCount';

  private productsSubject = new BehaviorSubject<ProductData[]>(this.readProducts());
  products$ = this.productsSubject.asObservable();

  loadProducts(): void {
    this.productsSubject.next(this.readProducts());
  }

  getProductsSnapshot(): ProductData[] {
    return this.productsSubject.value;
  }

  getProductById(pid: string): ProductData | undefined {
    return this.productsSubject.value.find(
      (product) => String(product.pid) === String(pid),
    );
  }

  addProduct(payload: Omit<ProductData, 'pid'>): ProductData {
    const product: ProductData = {
      pid: String(this.getNextProductId()),
      ...payload,
    };

    this.persistProducts([...this.productsSubject.value, product]);
    return product;
  }

  updateProduct(product: ProductData): void {
    const updated = this.productsSubject.value.map((item) =>
      item.pid === product.pid ? product : item,
    );
    this.persistProducts(updated);
  }

  deleteProduct(pid: string): void {
    const filtered = this.productsSubject.value.filter((product) => product.pid !== pid);
    this.persistProducts(filtered);
  }

  private readProducts(): ProductData[] {
    const raw = localStorage.getItem(ProductsService.PRODUCTS_KEY);
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw) as Partial<ProductData>[];
      return parsed.map((product) => ({
        pid: String(product.pid ?? ''),
        pname: String(product.pname ?? ''),
        ptitle: String(product.ptitle ?? ''),
        pprice: Number(product.pprice ?? 0),
        pdescription: String(product.pdescription ?? ''),
        pcategory: String(product.pcategory ?? ''),
      }));
    } catch {
      return [];
    }
  }

  private persistProducts(products: ProductData[]): void {
    localStorage.setItem(ProductsService.PRODUCTS_KEY, JSON.stringify(products));
    this.productsSubject.next(products);
  }

  private getNextProductId(): number {
    const currentId = Number(localStorage.getItem(ProductsService.PRODUCT_ID_KEY) ?? 0);
    const maxExisting = this.productsSubject.value.reduce((max, product) => {
      const parsedId = Number(product.pid);
      return Number.isFinite(parsedId) && parsedId > max ? parsedId : max;
    }, 0);

    const nextId = Math.max(currentId, maxExisting) + 1;
    localStorage.setItem(ProductsService.PRODUCT_ID_KEY, String(nextId));
    return nextId;
  }
}
