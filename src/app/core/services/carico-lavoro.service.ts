import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CaricoLavoro, CaricoLavoroCreateRequest } from '../models/carico-lavoro.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CaricoLavoroService {
  private readonly apiUrl = `${environment.apiUrl}/api/caricoLavoro`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<CaricoLavoro[]> {
    return this.http.get<CaricoLavoro[]>(this.apiUrl);
  }

  create(payload: CaricoLavoroCreateRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl, payload);
  }
}
