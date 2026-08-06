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
  listaUsuarios: any[] = [];

  ngOnInit(): void {
    this.usuarioToken = this.authService.obtenerToken();

    if (!this.usuarioToken || this.usuarioToken === 'undefined') {
      this.router.navigate(['/login']);
      return;
    }

    // Petición al backend para cargar la lista de usuarios
    this.authService.obtenerUsuarios().subscribe({
      next: (res: any) => {
        // Asigna la respuesta (si el backend responde un array o un objeto { usuarios: [] })
        this.listaUsuarios = Array.isArray(res) ? res : (res.usuarios || res.data || []);
      },
      error: (err) => {
        console.error('Error al obtener la lista de usuarios:', err);
      }
    });
  }

  onLogout(): void {
    this.authService.cerrarSesion();
  }
}