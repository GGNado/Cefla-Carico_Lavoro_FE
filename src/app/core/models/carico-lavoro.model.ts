/**
 * DTO returned by GET /api/caricoLavoro
 * Flat structure with display names instead of nested entities.
 */
export interface CaricoLavoro {
  id: number;
  inputDate: string;
  nomeAttivita: string;
  nomeCollaboratore: string;
  nomeUtente: string | null;
  quantity: number;
  estimatedTime: number | string;
  notes: string;
}

/**
 * DTO for POST /api/caricoLavoro
 * References entities by their IDs.
 */
export interface CaricoLavoroCreateRequest {
  idAttivita: number;
  idCollaboratore: number;
  idUtente: number;
  inputDate: string;
  quantity: number;
  estimatedTime: number;
  notes: string;
}
