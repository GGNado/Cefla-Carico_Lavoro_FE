import { Attivita } from './attivita.model';
import { Collaboratore } from './collaboratore.model';
import { Utente } from './utente.model';

export interface CaricoLavoro {
  id: number;
  inputDate: string;
  activityType: Attivita;
  collaborator: Collaboratore;
  quantity: number;
  estimatedTime: number;
  notes: string;
  deleted: boolean;
  deletedAt: string;
  createdBy: Utente;
  updatedBy: Utente;
  createdAt: string;
  updatedAt: string;
}

export interface CaricoLavoroCreateRequest {
  inputDate: string;
  activityTypeId: number;
  collaboratorId: number;
  quantity: number;
  estimatedTime?: number;
  notes?: string;
}
