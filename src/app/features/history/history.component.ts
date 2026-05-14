import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, DecimalPipe } from '@angular/common';
import { CaricoLavoroService } from '../../core/services/carico-lavoro.service';
import { CollaboratoreService } from '../../core/services/collaboratore.service';
import { AttivitaService } from '../../core/services/attivita.service';
import { CaricoLavoro } from '../../core/models/carico-lavoro.model';
import { Collaboratore } from '../../core/models/collaboratore.model';
import { Attivita } from '../../core/models/attivita.model';

@Component({
  selector: 'app-history',
  imports: [FormsModule, DatePipe],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css',
})
export class HistoryComponent implements OnInit {
  private caricoSvc = inject(CaricoLavoroService);
  private collabSvc = inject(CollaboratoreService);
  private attivSvc  = inject(AttivitaService);

  all           = signal<CaricoLavoro[]>([]);
  filtered      = signal<CaricoLavoro[]>([]);
  collaboratori = signal<Collaboratore[]>([]);
  attivita      = signal<Attivita[]>([]);
  loading       = signal(true);

  // Filters
  dateFrom        = '';
  dateTo          = '';
  collaboratorName = '';
  activityName     = '';

  // Pagination
  page      = 1;
  pageSize  = 10;

  get pagedItems(): CaricoLavoro[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filtered().slice(start, start + this.pageSize);
  }
  get totalPages(): number {
    return Math.ceil(this.filtered().length / this.pageSize);
  }

  ngOnInit(): void {
    this.caricoSvc.getAll().subscribe({ next: v => { this.all.set(v); this.apply(); this.loading.set(false); }, error: () => this.loading.set(false) });
    this.collabSvc.getAll().subscribe({ next: v => this.collaboratori.set(v) });
    this.attivSvc.getAll().subscribe({ next: v => this.attivita.set(v) });
  }

  pageEnd(): number {
    return Math.min(this.page * this.pageSize, this.filtered().length);
  }

  apply() {
    this.page = 1;
    let list = [...this.all()];
    if (this.dateFrom) list = list.filter(c => c.inputDate >= this.dateFrom);
    if (this.dateTo)   list = list.filter(c => c.inputDate <= this.dateTo);
    if (this.collaboratorName) list = list.filter(c => c.nomeCollaboratore === this.collaboratorName);
    if (this.activityName)     list = list.filter(c => c.nomeAttivita === this.activityName);
    this.filtered.set(list.sort((a, b) => new Date(b.inputDate).getTime() - new Date(a.inputDate).getTime()));
  }

  reset() {
    this.dateFrom = ''; this.dateTo = ''; this.collaboratorName = ''; this.activityName = '';
    this.apply();
  }

  setPage(p: number) {
    if (p >= 1 && p <= this.totalPages) this.page = p;
  }

  pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  /** Get unique collaborator names from the data for filter dropdown */
  uniqueCollaborators(): string[] {
    const names = new Set(this.all().map(c => c.nomeCollaboratore).filter(Boolean));
    return [...names].sort();
  }

  /** Get unique activity names from the data for filter dropdown */
  uniqueActivities(): string[] {
    const names = new Set(this.all().map(c => c.nomeAttivita).filter(Boolean));
    return [...names].sort();
  }

  initials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  }

  avatarColor(name: string): string {
    const colors = ['#E8450A','#3B3BF9','#10B981','#8B5CF6','#F59E0B'];
    let h = 0;
    for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffffff;
    return colors[h % colors.length];
  }

  formatHours(h: number | string): string {
    const val = typeof h === 'string' ? parseFloat(h) : h;
    const hrs = Math.floor(val);
    const mins = Math.round((val - hrs) * 60);
    return `${String(hrs).padStart(2,'0')}:${String(mins).padStart(2,'0')}h`;
  }
}
