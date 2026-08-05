import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  usuarioToken: string | null = '';
  listaUsuarios: any[] = []; // Se declara listaUsuarios para evitar el error TS2339

  ngOnInit(): void {
    this.usuarioToken = this.authService.obtenerToken();

    // Verificación de token para evitar el rebote al login
    if (!this.usuarioToken || this.usuarioToken === 'undefined') {
      this.router.navigate(['/login']);
    }
  }

  // Método onLogout que llama la plantilla HTML
  onLogout(): void {
    this.authService.cerrarSesion();
  }
}