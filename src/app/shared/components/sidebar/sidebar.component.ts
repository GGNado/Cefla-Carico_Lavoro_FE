import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TitleCasePipe, SlicePipe } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles?: string[];  // Se specificato, il link è visibile solo a chi ha uno di questi ruoli
}

const ICONS: Record<string, string> = {
  'grid':        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`,
  'plus-circle': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`,
  'clock':       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  'bar-chart-2': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  'users':       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  'tag':         `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`,
  'user':        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
};

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, TitleCasePipe, SlicePipe],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  auth = inject(AuthService);

  navItems: NavItem[] = [
    { label: 'Dashboard',      icon: 'grid',           route: '/dashboard'       },
    { label: 'Nuova Attività', icon: 'plus-circle',    route: '/workload/new'    },
    { label: 'Storico',        icon: 'clock',          route: '/history'         },
    { label: 'Report',         icon: 'bar-chart-2',    route: '/reports'         },
    { label: 'Collaboratori',  icon: 'users',          route: '/collaborators',  roles: ['ROLE_MANAGER', 'ROLE_ADMIN'] },
    { label: 'Tipi Attività',  icon: 'tag',            route: '/activity-types'  },
    { label: 'Utenti',         icon: 'user',           route: '/users',          roles: ['ROLE_ADMIN'] },
  ];

  /** Restituisce solo i navItems visibili per il ruolo dell'utente corrente */
  get visibleItems(): NavItem[] {
    return this.navItems.filter(item => {
      if (!item.roles) return true;
      return item.roles.some(role => this.auth.hasRole(role));
    });
  }

  getIcon(name: string): string {
    return ICONS[name] ?? '';
  }

  logout() {
    this.auth.logout();
  }
}
