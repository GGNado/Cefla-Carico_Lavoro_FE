import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Attivita, AttivitaCreateRequest, AttivitaFindAllResponse, AttivitaUpdateRequest} from '../models/attivita.model';
import {map} from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AttivitaService {
  private readonly apiUrl = `${environment.apiUrl}/api/attivita`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Attivita[]> {
    return this.http.get<AttivitaFindAllResponse>(this.apiUrl).pipe(
      map(res => res.AttivitaFindAllDTO)
    );
  }

  create(payload: AttivitaCreateRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl, payload);
  }

  update(payload: AttivitaUpdateRequest): Observable<any> {
    return this.http.patch<any>(this.apiUrl, payload);
  }

  softDelete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
