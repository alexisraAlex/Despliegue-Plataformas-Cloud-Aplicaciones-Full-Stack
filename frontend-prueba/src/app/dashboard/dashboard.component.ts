import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef); // Inyección para forzar el refresco de vista

  usuarioToken: string | null = '';
  listaUsuarios: any[] = [];
  cargando: boolean = true;

  ngOnInit(): void {
    this.usuarioToken = this.authService.obtenerToken();

    if (!this.usuarioToken || this.usuarioToken === 'undefined') {
      this.router.navigate(['/login']);
      return;
    }

    this.authService.obtenerUsuarios().subscribe({
      next: (res: any) => {
        console.log('Respuesta del backend:', res);

        if (Array.isArray(res)) {
          this.listaUsuarios = res;
        } else if (res && res.usuarios && Array.isArray(res.usuarios)) {
          this.listaUsuarios = res.usuarios;
        } else if (res && res.data && Array.isArray(res.data)) {
          this.listaUsuarios = res.data;
        } else {
          this.listaUsuarios = [];
        }

        this.cargando = false;
        this.cdr.detectChanges(); // Fuerza a Angular a pintar la tabla en pantalla inmediatamente
      },
      error: (err) => {
        console.error('Error al obtener la lista de usuarios:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  onLogout(): void {
    this.authService.cerrarSesion();
  }
}