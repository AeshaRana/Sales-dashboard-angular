import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {
 @Input({required:true}) cardDetails!:{
  title:string,
  value:string,
  change:string,
  // iconPath:string
 };


}
