import { Component } from '@angular/core';
import { MonthlySales } from "../monthly-sales/monthly-sales";
import { SalesByCategory } from "../sales-by-category/sales-by-category";
import { SalesByRegion } from "../sales-by-region/sales-by-region";

@Component({
  selector: 'app-analytics',
  imports: [MonthlySales, SalesByCategory, SalesByRegion],
  templateUrl: './analytics.html',
  styleUrl: './analytics.css',
})
export class Analytics {

}
