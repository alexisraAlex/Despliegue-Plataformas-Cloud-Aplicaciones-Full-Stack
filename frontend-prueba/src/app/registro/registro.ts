import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class RegistroComponent {
  nuevoUsuario = { nombre: '', email: '', password: '' };
  errorMsg: string = '';
  exitoMsg: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister(): void {
    this.authService.registrar(this.nuevoUsuario).subscribe({
      next: (res) => {
        this.exitoMsg = '¡Registrado con éxito! Redirigiendo...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.errorMsg = err.error?.msg || err.error?.mensaje || 'Error al procesar el registro.';
      }
    });
  }
}