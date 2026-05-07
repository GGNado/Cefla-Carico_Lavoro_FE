import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Attivita, AttivitaCreateRequest, AttivitaFindAllResponse} from '../models/attivita.model';
import {map} from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AttivitaService {
  private readonly apiUrl = 'http://localhost:8080/api/attivita';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Attivita[]> {
    return this.http.get<AttivitaFindAllResponse>(this.apiUrl).pipe(
      map(res => res.AttivitaFindAllDTO)
    );
  }

  create(payload: AttivitaCreateRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl, payload);
  }
}
