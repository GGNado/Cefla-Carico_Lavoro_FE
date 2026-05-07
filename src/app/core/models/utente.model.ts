import { Role } from './role.model';

export interface Utente {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  enabled: boolean;
  roles: Role[];
  createdAt?: string;   // non sempre presente nella risposta API
}

export interface UtenteFindAllResponse {
  UtenteFindAllDTO: Utente[];
}
