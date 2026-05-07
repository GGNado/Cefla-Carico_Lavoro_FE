import { Utente } from './utente.model';

export interface Collaboratore {
  id: number;
  fullName: string;
  utente: Utente;
}

export interface CollaboratoreCreateRequest {
  fullName: string;
  email: string;
}

export interface CollaboratoreFindAllResponse {
  CollaboratoreFindAllDTO: Collaboratore[];
}
