import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UtenteService } from '../../core/services/utente.service';
import { Utente } from '../../core/models/utente.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-users',
  imports: [FormsModule, DatePipe],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  private svc = inject(UtenteService);

  utenti   = signal<Utente[]>([]);
  filtered = signal<Utente[]>([]);
  loading  = signal(true);
  search   = '';

  ngOnInit(): void {
    this.svc.getAll().subscribe({
      next: (v) => { this.utenti.set(v); this.filtered.set(v); this.loading.set(false); },
      error: () => this.loading.set(false),
    });

    console.log(this.utenti);
  }

  onSearch() {
    const q = this.search.toLowerCase();
    this.filtered.set(
      this.utenti().filter(u =>
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.firstName.toLowerCase().includes(q) ||
        u.lastName.toLowerCase().includes(q)
      )
    );
  }

  initials(u: Utente): string {
    return `${u.firstName[0]}${u.lastName[0]}`.toUpperCase();
  }

  avatarColor(name: string): string {
    const colors = ['#E8450A','#3B3BF9','#10B981','#8B5CF6','#F59E0B'];
    let h = 0;
    for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffffff;
    return colors[h % colors.length];
  }

  roleBadge(roles: any[]): string {
    const r = roles?.[0]?.name ?? '';
    return r.replace('ROLE_', '');
  }
}
