import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CaricoLavoro, CaricoLavoroCreateRequest } from '../models/carico-lavoro.model';

@Injectable({ providedIn: 'root' })
export class CaricoLavoroService {
  private readonly apiUrl = 'http://localhost:8080/api/caricoLavoro';

  constructor(private http: HttpClient) {}

  getAll(): Observable<CaricoLavoro[]> {
    return this.http.get<CaricoLavoro[]>(this.apiUrl);
  }

  create(payload: CaricoLavoroCreateRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl, payload);
  }
}
