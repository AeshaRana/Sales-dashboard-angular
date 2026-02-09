import { Routes } from '@angular/router';
import { Dashboard } from './Dashboard/dashboard/dashboard';
import { Orders } from './Orders/orders/orders';
import { Customers } from './Customers/customers/customers';
import { Title } from '@angular/platform-browser';
import { AddOrder } from './Orders/add-order/add-order';
import { AddCustomer } from './Customers/add-customer/add-customer';
import { ProductComponentTs } from './products/product.component.ts/product.component.ts';
import { AddProduct } from './products/add-product/add-product';


export const routes: Routes = [
    {path:'',component:Dashboard,data:{title:'dashboard'}},
    {path:'dashboard',component:Dashboard,data:{title:'dashboard'}},
    {path:'orders',component:Orders,data:{title:'orders'},},
    {path:'orders/add',component:AddOrder,data:{title:'add/add-order'}},
    {path:'customers',component:Customers,data:{title:'customers'}},
    {path:'customers/add',component:AddCustomer,data:{title:'customers/add-customer'}},
    {path:'product',component:ProductComponentTs,data:{title:'products'}},
    {path:'product/add',component:AddProduct,data:{title:'products/add-product'}},
    {path:'**',redirectTo:''}
];
