import { Component, inject, OnInit, signal } from '@angular/core';
import { DecimalPipe, SlicePipe } from '@angular/common';
import { CaricoLavoroService } from '../../core/services/carico-lavoro.service';
import { CaricoLavoro } from '../../core/models/carico-lavoro.model';

@Component({
  selector: 'app-reports',
  imports: [DecimalPipe, SlicePipe],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
})
export class ReportsComponent implements OnInit {
  private svc = inject(CaricoLavoroService);

  carichi = signal<CaricoLavoro[]>([]);
  loading = signal(true);

  get totalHours(): number {
    return +this.carichi().reduce((s, c) => s + (c.estimatedTime ?? 0), 0).toFixed(1);
  }
  get totalQty(): number {
    return this.carichi().reduce((s, c) => s + (c.quantity ?? 0), 0);
  }

  collaboratorStats() {
    const map = new Map<string, number>();
    this.carichi().filter(c => !c.deleted).forEach(c => {
      const name = c.collaborator?.fullName ?? 'N/A';
      map.set(name, (map.get(name) ?? 0) + (c.estimatedTime ?? 0));
    });
    const max = Math.max(...map.values(), 1);
    return [...map.entries()]
      .map(([name, hours]) => ({ name, hours: +hours.toFixed(1), pct: Math.round(hours / max * 100) }))
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 6);
  }

  activityStats() {
    const map = new Map<string, number>();
    this.carichi().filter(c => !c.deleted).forEach(c => {
      const name = c.activityType?.name ?? 'N/A';
      map.set(name, (map.get(name) ?? 0) + (c.estimatedTime ?? 0));
    });
    const total = [...map.values()].reduce((s, v) => s + v, 0) || 1;
    return [...map.entries()]
      .map(([name, hours]) => ({ name, hours: +hours.toFixed(1), pct: Math.round(hours / total * 100) }))
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 5);
  }

  dailyTrend() {
    const map = new Map<string, number>();
    this.carichi().filter(c => !c.deleted).forEach(c => {
      map.set(c.inputDate, (map.get(c.inputDate) ?? 0) + (c.estimatedTime ?? 0));
    });
    return [...map.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-14)
      .map(([date, hours]) => ({ date, hours: +hours.toFixed(1) }));
  }

  get maxDailyHours(): number {
    return Math.max(...this.dailyTrend().map(d => d.hours), 1);
  }

  ngOnInit(): void {
    this.svc.getAll().subscribe({ next: v => { this.carichi.set(v); this.loading.set(false); }, error: () => this.loading.set(false) });
  }

  formatDate(s: string): string {
    const d = new Date(s);
    return `${d.getDate()}/${d.getMonth()+1}`;
  }
}
