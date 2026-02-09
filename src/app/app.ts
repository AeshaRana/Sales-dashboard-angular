import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./header/header";
import { Sidebar } from "./sidebar/sidebar";
import { Footer } from "./Footer/footer/footer";

@Component({
  selector: 'app-root',
  imports: [Header, Sidebar, RouterOutlet, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
  
})
export class App {
  isMobileSidebarOpen = false;

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  toggleMobileSidebar(): void {
    this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
    this.syncSidebarOpenClass();
  }

  closeMobileSidebar(): void {
    if (!this.isMobileSidebarOpen) {
      return;
    }

    this.isMobileSidebarOpen = false;
    this.syncSidebarOpenClass();
  }

  private syncSidebarOpenClass(): void {
    if (this.isMobileSidebarOpen) {
      this.renderer.addClass(this.document.body, 'sidebar-open');
      return;
    }

    this.renderer.removeClass(this.document.body, 'sidebar-open');
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (window.innerWidth > 900) {
      this.closeMobileSidebar();
    }
  }
}
