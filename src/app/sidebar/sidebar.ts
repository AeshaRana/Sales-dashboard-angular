import { Component, EventEmitter, Output, Renderer2 } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  standalone:true,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  @Output() navigate = new EventEmitter<void>();

  isSidebarCollapsed = false;

  constructor(private renderer:Renderer2)
  {

  }

  toggleSidebar()
  {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;

    if (this.isSidebarCollapsed)
    {
        this.renderer.addClass(document.body, "sidebar-collapsed");
    }
    else
    {
       this.renderer.removeClass(document.body, "sidebar-collapsed");
    }
  }

  onNavClick(): void {
    this.navigate.emit();
  }
}
