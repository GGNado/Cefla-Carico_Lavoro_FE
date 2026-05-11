import { Utente } from './utente.model';

export interface Collaboratore {
  id: number;
  fullName: string;
  utente: Utente;
}

export interface CollaboratoreCreateRequest {
  fullName: string;
  email: string | null;
}

export interface CollaboratoreUpdateRequest {
  id: number;
  fullName?: string;
  email?: string | null;
}

export interface CollaboratoreFindAllResponse {
  CollaboratoreFindAllDTO: Collaboratore[];
}
