import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AttivitaService } from '../../core/services/attivita.service';
import { Attivita, AttivitaCreateRequest } from '../../core/models/attivita.model';
import { DatePipe, DecimalPipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-activity-types',
  imports: [FormsModule, DecimalPipe],
  templateUrl: './activity-types.component.html',
  styleUrl: './activity-types.component.css',
})
export class ActivityTypesComponent implements OnInit {
  private svc = inject(AttivitaService);
  auth = inject(AuthService);

  attivita  = signal<Attivita[]>([]);
  filtered  = signal<Attivita[]>([]);
  loading   = signal(true);
  showModal = signal(false);
  saving    = signal(false);
  errorMsg  = signal('');
  search    = '';

  form: AttivitaCreateRequest = { name: '', averageTime: 0 };

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.svc.getAll().subscribe({
      next: (v) => {
        this.attivita.set(v);
        this.filtered.set(v);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onSearch() {
    const q = this.search.toLowerCase();
    this.filtered.set(this.attivita().filter((a) => a.name.toLowerCase().includes(q)));
  }

  get totalTypes() { return this.attivita().length; }
  get avgTime() {
    const list = this.attivita();
    if (!list.length) return 0;
    return +(list.reduce((s, a) => s + a.averageTime, 0) / list.length).toFixed(1);
  }
  get mostActive(): string {
    const sorted = [...this.attivita()].sort((a, b) => b.averageTime - a.averageTime);
    return sorted[0]?.name ?? '—';
  }

  maxTime(): number {
    return Math.max(...this.attivita().map(a => a.averageTime), 1);
  }

  openModal() {
    this.form = { name: '', averageTime: 0 };
    this.errorMsg.set('');
    this.showModal.set(true);
  }

  closeModal() { this.showModal.set(false); }

  save() {
    if (!this.form.name || !this.form.averageTime) {
      this.errorMsg.set('Nome e tempo medio sono obbligatori.');
      return;
    }
    this.saving.set(true);
    this.svc.create(this.form).subscribe({
      next: () => { this.saving.set(false); this.closeModal(); this.load(); },
      error: () => { this.saving.set(false); this.errorMsg.set('Errore durante il salvataggio.'); },
    });
  }
}
