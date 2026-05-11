import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AttivitaService } from '../../core/services/attivita.service';
import { Attivita, AttivitaCreateRequest, AttivitaUpdateRequest } from '../../core/models/attivita.model';
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

  /* Modal mode: 'create' or 'edit' */
  modalMode = signal<'create' | 'edit'>('create');
  editingId: number | null = null;

  form: AttivitaCreateRequest = { name: '', averageTime: 0 };

  /* Confirm-delete state */
  showDeleteConfirm = signal(false);
  deletingId: number | null = null;
  deletingName = '';
  deleting = signal(false);

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.svc.getAll().subscribe({
      next: (v) => {
        this.attivita.set(v);
        this.applyFilter();
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onSearch() {
    this.applyFilter();
  }

  private applyFilter() {
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

  /* ── Create ─────────────────────────────────────────── */
  openModal() {
    this.modalMode.set('create');
    this.editingId = null;
    this.form = { name: '', averageTime: 0 };
    this.errorMsg.set('');
    this.showModal.set(true);
  }

  /* ── Edit ───────────────────────────────────────────── */
  openEditModal(a: Attivita) {
    this.modalMode.set('edit');
    this.editingId = a.id;
    this.form = { name: a.name, averageTime: a.averageTime };
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

    if (this.modalMode() === 'edit' && this.editingId !== null) {
      const payload: AttivitaUpdateRequest = {
        id: this.editingId,
        name: this.form.name,
        active: this.attivita().find((a) => a.name.toLowerCase() === this.form.name.toLowerCase())?.active ?? true,
        averageTime: this.form.averageTime,
      };
      this.svc.update(payload).subscribe({
        next: () => { this.saving.set(false); this.closeModal(); this.load(); },
        error: () => { this.saving.set(false); this.errorMsg.set('Errore durante l\'aggiornamento.'); },
      });
    } else {
      this.svc.create(this.form).subscribe({
        next: () => { this.saving.set(false); this.closeModal(); this.load(); },
        error: () => { this.saving.set(false); this.errorMsg.set('Errore durante il salvataggio.'); },
      });
    }
  }

  /* ── Toggle Active (Disabilita / Abilita) ───────────── */
  toggleActive(a: Attivita) {
    const payload: AttivitaUpdateRequest = { id: a.id, active: !a.active };
    this.svc.update(payload).subscribe({
      next: () => this.load(),
      error: () => this.errorMsg.set('Errore durante l\'aggiornamento dello stato.'),
    });
  }

  /* ── Soft Delete ────────────────────────────────────── */
  confirmDelete(a: Attivita) {
    this.deletingId = a.id;
    this.deletingName = a.name;
    this.showDeleteConfirm.set(true);
  }

  cancelDelete() {
    this.showDeleteConfirm.set(false);
    this.deletingId = null;
    this.deletingName = '';
  }

  executeDelete() {
    if (this.deletingId === null) return;
    this.deleting.set(true);
    this.svc.softDelete(this.deletingId).subscribe({
      next: () => { this.deleting.set(false); this.cancelDelete(); this.load(); },
      error: () => { this.deleting.set(false); this.errorMsg.set('Errore durante l\'eliminazione.'); },
    });
  }
}
