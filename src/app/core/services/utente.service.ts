import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {Utente, UtenteFindAllResponse} from '../models/utente.model';

@Injectable({ providedIn: 'root' })
export class UtenteService {
  private readonly apiUrl = 'http://localhost:8080/api/utenti';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Utente[]> {
    return this.http.get<UtenteFindAllResponse>(this.apiUrl).pipe(
      map(res => res.UtenteFindAllDTO)
    );
  }
}
