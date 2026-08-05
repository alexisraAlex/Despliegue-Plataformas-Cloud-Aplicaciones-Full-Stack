import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  credenciales = { email: '', password: '' };
  errorMsg: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.authService.login(this.credenciales).subscribe({
      next: (res: any) => {
        // Extraemos el token compatible tanto con accessToken como con token
        const token = res.accessToken || res.token;

        if (token) {
          this.authService.guardarToken(token);
          if (res.refreshToken) {
            localStorage.setItem('refreshToken', res.refreshToken);
          }
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMsg = 'Respuesta del servidor inválida.';
        }
      },
      error: (err: any) => {
        this.errorMsg = err.error?.msg || err.error?.mensaje || 'Error de conexión con el servidor.';
      }
    });
  }
}