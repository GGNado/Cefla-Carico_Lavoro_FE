export interface Role {
  id?: number;          // non sempre presente nella risposta API
  name: string;
  description: string;
  createdAt?: string;   // non sempre presente nella risposta API
}
