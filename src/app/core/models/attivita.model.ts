import {Utente} from './utente.model';

export interface Attivita {
  id: number;
  name: string;
  averageTime: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AttivitaCreateRequest {
  name: string;
  averageTime: number;
}

export interface AttivitaUpdateRequest {
  id: number;
  name?: string;
  averageTime?: number;
  active?: boolean;
}

export interface AttivitaFindAllResponse {
  AttivitaFindAllDTO: Attivita[];
}
