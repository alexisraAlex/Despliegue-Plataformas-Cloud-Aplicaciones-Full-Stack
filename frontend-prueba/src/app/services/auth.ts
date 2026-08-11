import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private apiUrl = environment.apiUrl; 

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(res => {
        const token = res.accessToken || res.token;
        if (token) {
          this.guardarToken(token);
          if (res.refreshToken) {
            localStorage.setItem('refreshToken', res.refreshToken);
          }
        }
      })
    );
  }

  registrar(usuario: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/register`, usuario);
  }

  obtenerUsuarios(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users`, { headers: this.obtenerHeaders() });
  }

  guardarToken(token: string): void {
    localStorage.setItem('token', token);
  }

  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  cerrarSesion(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.obtenerToken();
  }

  // ==================== MÉTODOS PARA EL RESTO DE COLECCIONES ====================

  private obtenerHeaders(): HttpHeaders {
    const token = this.obtenerToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  obtenerColeccion(coleccion: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${coleccion}`, { headers: this.obtenerHeaders() });
  }

  crearRegistro(coleccion: string, data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${coleccion}`, data, { headers: this.obtenerHeaders() });
  }

  actualizarRegistro(coleccion: string, id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${coleccion}/${id}`, data, { headers: this.obtenerHeaders() });
  }

  eliminarRegistro(coleccion: string, id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${coleccion}/${id}`, { headers: this.obtenerHeaders() });
  }
}