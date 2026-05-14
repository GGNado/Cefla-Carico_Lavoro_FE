import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { CaricoLavoroService } from '../../core/services/carico-lavoro.service';
import { CollaboratoreService } from '../../core/services/collaboratore.service';
import { CaricoLavoro } from '../../core/models/carico-lavoro.model';
import { Collaboratore } from '../../core/models/collaboratore.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, DatePipe, DecimalPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private caricoSvc  = inject(CaricoLavoroService);
  private collabSvc  = inject(CollaboratoreService);
  auth               = inject(AuthService);

  carichi        = signal<CaricoLavoro[]>([]);
  collaboratori  = signal<Collaboratore[]>([]);
  loading        = signal(true);

  private parseTime(val: number | string): number {
    return typeof val === 'string' ? parseFloat(val) || 0 : val ?? 0;
  }

  get totalHours(): number {
    return this.carichi().reduce((s, c) => s + this.parseTime(c.estimatedTime), 0);
  }
  get totalEntries(): number {
    return this.carichi().length;
  }
  get activeCollab(): number {
    return this.collaboratori().length;
  }
  get recentActivities(): CaricoLavoro[] {
    return [...this.carichi()]
      .sort((a, b) => new Date(b.inputDate).getTime() - new Date(a.inputDate).getTime())
      .slice(0, 5);
  }

  topCollaborators() {
    const map = new Map<string, { name: string; hours: number }>();
    this.carichi().forEach(c => {
      const name = c.nomeCollaboratore ?? '—';
      const cur = map.get(name) ?? { name, hours: 0 };
      map.set(name, { ...cur, hours: cur.hours + this.parseTime(c.estimatedTime) });
    });
    return [...map.values()].sort((a, b) => b.hours - a.hours).slice(0, 3);
  }

  activityStats() {
    const map = new Map<string, number>();
    this.carichi().forEach(c => {
      const name = c.nomeAttivita ?? '—';
      map.set(name, (map.get(name) ?? 0) + this.parseTime(c.estimatedTime));
    });
    const total = [...map.values()].reduce((s, v) => s + v, 0) || 1;
    return [...map.entries()]
      .map(([name, hours]) => ({ name, hours: +hours.toFixed(1), pct: Math.round(hours / total * 100) }))
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 5);
  }

  initials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  }

  avatarColor(name: string): string {
    const colors = ['#E8450A','#3B3BF9','#10B981','#8B5CF6','#F59E0B','#EF4444'];
    let h = 0;
    for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xFFFFFF;
    return colors[h % colors.length];
  }

  ngOnInit(): void {
    this.caricoSvc.getAll().subscribe({ next: v => { this.carichi.set(v); this.loading.set(false); }, error: () => this.loading.set(false) });
    this.collabSvc.getAll().subscribe({ next: v => this.collaboratori.set(v) });
  }
}
