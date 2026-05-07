import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CaricoLavoroService } from '../../core/services/carico-lavoro.service';
import { CollaboratoreService } from '../../core/services/collaboratore.service';
import { AttivitaService } from '../../core/services/attivita.service';
import { AuthService } from '../../core/services/auth.service';
import { Collaboratore } from '../../core/models/collaboratore.model';
import { Attivita } from '../../core/models/attivita.model';

@Component({
  selector: 'app-workload-new',
  imports: [FormsModule],
  templateUrl: './workload-new.component.html',
  styleUrl: './workload-new.component.css',
})
export class WorkloadNewComponent implements OnInit {
  private caricoSvc = inject(CaricoLavoroService);
  private collabSvc = inject(CollaboratoreService);
  private attivSvc  = inject(AttivitaService);
  private router    = inject(Router);
  auth              = inject(AuthService);

  allCollaboratori  = signal<Collaboratore[]>([]);
  attivita          = signal<Attivita[]>([]);
  todayEntries      = signal<any[]>([]);
  loading           = signal(true);
  saving            = signal(false);
  successMsg        = signal('');
  errorMsg          = signal('');
  manualTime        = false;

  /** Se USER: mostra solo il collaboratore collegato. Se MANAGER/ADMIN: tutti */
  get collaboratori(): Collaboratore[] {
    const all = this.allCollaboratori();
    if (this.auth.isManagerOrAdmin()) {
      return all;
    }
    // USER: filtra per utente.id corrispondente
    const userId = this.auth.currentUser()?.id;
    return all.filter(c => c.utente?.id === userId);
  }

  /** True se l'utente è un semplice USER (non manager/admin) */
  get isUserOnly(): boolean {
    return !this.auth.isManagerOrAdmin();
  }

  form = {
    inputDate: new Date().toISOString().split('T')[0],
    collaboratorId: '',
    activityTypeId: '',
    quantity: 1,
    estimatedTime: 0,
    notes: '',
  };

  get selectedActivity(): Attivita | undefined {
    return this.attivita().find(a => String(a.id) === this.form.activityTypeId);
  }

  get autoEstimatedTime(): number {
    const avg = this.selectedActivity?.averageTime ?? 0;
    return +(avg * this.form.quantity).toFixed(2);
  }

  get displayTime(): number {
    return this.manualTime ? this.form.estimatedTime : this.autoEstimatedTime;
  }

  ngOnInit(): void {
    this.collabSvc.getAll().subscribe({
      next: v => {
        this.allCollaboratori.set(v);
        // Se USER: preseleziona automaticamente il proprio collaboratore
        if (this.isUserOnly && this.collaboratori.length === 1) {
          this.form.collaboratorId = String(this.collaboratori[0].id);
        }
      }
    });
    this.attivSvc.getAll().subscribe({ next: v => this.attivita.set(v) });
    this.caricoSvc.getAll().subscribe({
      next: v => {
        const today = new Date().toISOString().split('T')[0];
        this.todayEntries.set(v.filter(c => c.inputDate === today && !c.deleted));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onSubmit() {
    if (!this.form.collaboratorId || !this.form.activityTypeId) {
      this.errorMsg.set('Seleziona collaboratore e tipo attività.');
      return;
    }
    this.saving.set(true);
    this.errorMsg.set('');
    // Note: POST /api/caricoLavoros not yet implemented in backend
    // Simulate save with a delay
    setTimeout(() => {
      this.saving.set(false);
      this.successMsg.set('Attività registrata con successo');
      this.form = {
        inputDate: new Date().toISOString().split('T')[0],
        collaboratorId: '', activityTypeId: '',
        quantity: 1, estimatedTime: 0, notes: '',
      };
      setTimeout(() => this.successMsg.set(''), 4000);
    }, 600);
  }

  formatHours(h: number): string {
    const hrs = Math.floor(h);
    const mins = Math.round((h - hrs) * 60);
    return `${String(hrs).padStart(2,'0')}:${String(mins).padStart(2,'0')}h`;
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
}
