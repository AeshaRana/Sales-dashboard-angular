import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
  QueryList,
  ViewChildren,
  inject,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [],
  standalone:true,
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  @Output() menuToggle = new EventEmitter<void>();
  @ViewChildren('menuDetails') menuDetails!: QueryList<ElementRef<HTMLDetailsElement>>;

  route=inject(Router);
  activatedRoute=inject(ActivatedRoute);

  pageTitle="";

  constructor()
  {
    this.route.events.pipe(filter((event)=>event instanceof NavigationEnd)).subscribe(
     ()=>{
      this.displayTitle();
     }
    )

    this.displayTitle();
  }

  displayTitle()
  {
      let currentRoute=this.route.routerState.root;
      
      while(currentRoute.firstChild)
      {
        currentRoute=currentRoute.firstChild;
      }

      this.pageTitle=currentRoute.snapshot.data['title'] || '';
  }

  onMenuToggle(): void {
    this.menuToggle.emit();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as Node | null;
    if (!target) {
      return;
    }

    const clickedInsideMenu = this.menuDetails?.some((menu) =>
      menu.nativeElement.contains(target),
    );

    if (!clickedInsideMenu) {
      this.closeAllMenus();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeAllMenus();
  }

  private closeAllMenus(): void {
    this.menuDetails?.forEach((menu) => {
      menu.nativeElement.open = false;
    });
  }
}
