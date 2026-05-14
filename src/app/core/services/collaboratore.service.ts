import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Collaboratore, CollaboratoreCreateRequest, CollaboratoreFindAllResponse, CollaboratoreUpdateRequest} from '../models/collaboratore.model';
import {map} from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CollaboratoreService {
  private readonly apiUrl = `${environment.apiUrl}/api/collaboratori`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Collaboratore[]> {
    return this.http.get<CollaboratoreFindAllResponse>(this.apiUrl).pipe(
      map(res => res.CollaboratoreFindAllDTO)
    );
  }

  create(payload: CollaboratoreCreateRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl, payload);
  }

  update(payload: CollaboratoreUpdateRequest): Observable<any> {
    return this.http.patch<any>(this.apiUrl, payload);
  }
}
