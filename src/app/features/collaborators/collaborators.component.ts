import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CollaboratoreService } from '../../core/services/collaboratore.service';
import { Collaboratore, CollaboratoreCreateRequest, CollaboratoreUpdateRequest } from '../../core/models/collaboratore.model';

@Component({
  selector: 'app-collaborators',
  imports: [FormsModule],
  templateUrl: './collaborators.component.html',
  styleUrl: './collaborators.component.css',
})
export class CollaboratorsComponent implements OnInit {
  private svc = inject(CollaboratoreService);

  collaboratori = signal<Collaboratore[]>([]);
  filtered      = signal<Collaboratore[]>([]);
  loading       = signal(true);
  showModal     = signal(false);
  saving        = signal(false);
  errorMsg      = signal('');
  search        = '';

  /* Modal mode: 'create' or 'edit' */
  modalMode = signal<'create' | 'edit'>('create');
  editingId: number | null = null;

  form: CollaboratoreCreateRequest = { fullName: '', email: '' };

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.svc.getAll().subscribe({
      next: (v) => {
        this.collaboratori.set(v);
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
    this.filtered.set(
      this.collaboratori().filter(
        (c) => c.fullName.toLowerCase().includes(q) || (c.utente?.email ?? '').toLowerCase().includes(q)
      )
    );
  }

  /* ── Create ─────────────────────────────────────────── */
  openModal() {
    this.modalMode.set('create');
    this.editingId = null;
    this.form = { fullName: '', email: '' };
    this.errorMsg.set('');
    this.showModal.set(true);
  }

  /* ── Edit ───────────────────────────────────────────── */
  openEditModal(c: Collaboratore) {
    this.modalMode.set('edit');
    this.editingId = c.id;
    this.form = {
      fullName: c.fullName,
      email: c.utente?.email ?? '',
    };
    this.errorMsg.set('');
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  save() {
    if (!this.form.fullName) {
      this.errorMsg.set('Full Name obbligatorio');
      return;
    }
    this.saving.set(true);

    // Normalize email: convert empty or whitespace-only to null, otherwise trim
    const emailVal = this.form.email ?? '';
    if (emailVal.trim() === '') {
      this.form.email = null;
    } else {
      this.form.email = emailVal.trim();
    }

    if (this.modalMode() === 'edit' && this.editingId !== null) {
      const payload: CollaboratoreUpdateRequest = {
        id: this.editingId,
        fullName: this.form.fullName,
        email: this.form.email,
      };
      this.svc.update(payload).subscribe({
        next: () => {
          this.saving.set(false);
          this.closeModal();
          this.load();
        },
        error: () => {
          this.saving.set(false);
          this.errorMsg.set('Errore durante l\'aggiornamento.');
        },
      });
    } else {
      this.svc.create(this.form).subscribe({
        next: () => {
          this.saving.set(false);
          this.closeModal();
          this.load();
        },
        error: () => {
          this.saving.set(false);
          this.errorMsg.set('Errore durante il salvataggio.');
        },
      });
    }
  }

  initials(name: string): string {
    return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  }

  avatarColor(name: string): string {
    const colors = ['#E8450A', '#3B3BF9', '#10B981', '#8B5CF6', '#F59E0B'];
    let h = 0;
    for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffffff;
    return colors[h % colors.length];
  }
}
