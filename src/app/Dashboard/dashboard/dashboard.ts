import { Component } from '@angular/core';
import { Analytics } from "../../Analytics/analytics/analytics";
import { Cards } from "../../Cards/cards/cards";

@Component({
  selector: 'app-dashboard',
  imports: [Analytics, Cards],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

}
