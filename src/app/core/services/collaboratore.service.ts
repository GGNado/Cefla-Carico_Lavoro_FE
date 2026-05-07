import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Collaboratore, CollaboratoreCreateRequest, CollaboratoreFindAllResponse} from '../models/collaboratore.model';
import {map} from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CollaboratoreService {
  private readonly apiUrl = 'http://localhost:8080/api/collaboratori';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Collaboratore[]> {
    return this.http.get<CollaboratoreFindAllResponse>(this.apiUrl).pipe(
      map(res => res.CollaboratoreFindAllDTO)
    );
  }

  create(payload: CollaboratoreCreateRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl, payload);
  }
}
