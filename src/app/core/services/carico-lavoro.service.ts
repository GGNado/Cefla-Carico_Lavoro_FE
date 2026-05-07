import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CaricoLavoro } from '../models/carico-lavoro.model';

@Injectable({ providedIn: 'root' })
export class CaricoLavoroService {
  private readonly apiUrl = 'http://localhost:8080/api/caricoLavoros';

  constructor(private http: HttpClient) {}

  getAll(): Observable<CaricoLavoro[]> {
    return this.http.get<CaricoLavoro[]>(this.apiUrl);
  }
}
