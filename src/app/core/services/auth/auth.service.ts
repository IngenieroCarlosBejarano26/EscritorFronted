import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthRequest, AuthResponse } from './auth.models';
import { TOKEN_KEY, EXPIRES_KEY } from './auth.constants';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = environment.authApiUrl;
  private readonly tokenKey = TOKEN_KEY;
  private readonly expiresKey = EXPIRES_KEY;

  constructor(private http: HttpClient) {}

  requestToken(userName: string, password: string): Observable<AuthResponse> {
    const body: AuthRequest = { userName, password };    
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, body).pipe(
      tap((res) => this.setSession(res)),
      catchError((err) => {
        console.error('Auth request failed', err);
        return throwError(() => err);
      })
    );
  }

  generateTokenFromApp(userName?: string, password?: string): Observable<AuthResponse> {
    const u = userName ?? environment.defaultAuthUser;
    const p = password ?? environment.defaultAuthPassword;
    return this.requestToken(u, p);
  }

  private setSession(res: AuthResponse): void {
    localStorage.setItem(this.tokenKey, res.token);
    localStorage.setItem(this.expiresKey, res.expiresAt);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getTokenExpiration(): Date | null {
    const v = localStorage.getItem(this.expiresKey);
    return v ? new Date(v) : null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const exp = this.getTokenExpiration();
    if (!token || !exp) return false;
    return exp.getTime() > new Date().getTime();
  }

 
}

