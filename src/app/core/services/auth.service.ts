import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { JwtResponse, LoginRequest, MessageResponse, RegisterRequest } from '../models/auth.model';
import { environment } from '../../../environments/environment';

const TOKEN_KEY = 'ccs_token';
const USER_KEY = 'ccs_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/api/auth`;

  currentUser = signal<JwtResponse | null>(this.loadUser());

  constructor(private http: HttpClient) {}

  signin(payload: LoginRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.apiUrl}/signin`, payload).pipe(
      tap((res) => this.saveSession(res))
    );
  }

  signup(payload: RegisterRequest): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.apiUrl}/signup`, payload);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUser.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /** Controlla se l'utente corrente possiede un determinato ruolo */
  hasRole(role: string): boolean {
    return this.currentUser()?.roles?.includes(role) ?? false;
  }

  isAdmin(): boolean {
    return this.hasRole('ROLE_ADMIN');
  }

  isManager(): boolean {
    return this.hasRole('ROLE_MANAGER');
  }

  /** Manager o Admin */
  isManagerOrAdmin(): boolean {
    return this.isAdmin() || this.isManager();
  }

  private saveSession(res: JwtResponse): void {
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USER_KEY, JSON.stringify(res));
    console.log('User logged in:', res);
    this.currentUser.set(res);
  }

  private loadUser(): JwtResponse | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}
