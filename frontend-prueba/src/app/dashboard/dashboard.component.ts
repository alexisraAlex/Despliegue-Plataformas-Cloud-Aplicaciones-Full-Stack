import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, FormsModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  usuarioToken: string | null = '';
  
  // Estado para navegación de módulos
  moduloActivo: string = 'usuarios'; 
  listaDatos: any[] = [];
  cargando: boolean = true;

  // Formulario para crear nuevos registros dinámicamente
  nuevoRegistro: any = {};

  ngOnInit(): void {
    this.usuarioToken = this.authService.obtenerToken();

    if (!this.usuarioToken || this.usuarioToken === 'undefined') {
      this.router.navigate(['/login']);
      return;
    }

    // Carga inicial por defecto
    this.cambiarModulo('usuarios');
  }

  cambiarModulo(modulo: string): void {
    this.moduloActivo = modulo;
    this.cargando = true;
    this.nuevoRegistro = {};

    // Si es usuarios usamos tu método original, de lo contrario el genérico
    const peticion = (modulo === 'usuarios') 
      ? this.authService.obtenerUsuarios() 
      : this.authService.obtenerColeccion(modulo);

    peticion.subscribe({
      next: (res: any) => {
        console.log(`Respuesta del backend (${modulo}):`, res);

        if (Array.isArray(res)) {
          this.listaDatos = res;
        } else if (res && res.usuarios && Array.isArray(res.usuarios)) {
          this.listaDatos = res.usuarios;
        } else if (res && res.data && Array.isArray(res.data)) {
          this.listaDatos = res.data;
        } else {
          this.listaDatos = [];
        }

        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(`Error al obtener datos de ${modulo}:`, err);
        this.listaDatos = [];
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  crear(): void {
    this.authService.crearRegistro(this.moduloActivo, this.nuevoRegistro).subscribe({
      next: () => {
        this.cambiarModulo(this.moduloActivo);
      },
      error: (err) => {
        console.error('Error al crear registro:', err);
        alert(err.error?.mensaje || 'Error al guardar el registro');
      }
    });
  }

  eliminar(id: string): void {
    if (confirm('¿Está seguro de eliminar este registro?')) {
      this.authService.eliminarRegistro(this.moduloActivo, id).subscribe({
        next: () => {
          this.cambiarModulo(this.moduloActivo);
        },
        error: (err) => {
          console.error('Error al eliminar registro:', err);
          alert(err.error?.mensaje || 'No tienes permisos para eliminar este registro');
        }
      });
    }
  }

  onLogout(): void {
    this.authService.cerrarSesion();
  }
}