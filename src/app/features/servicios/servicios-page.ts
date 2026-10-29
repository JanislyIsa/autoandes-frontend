import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { Servicio } from '../../core/models/api.models';
import { ServicioService } from '../../core/services/servicio.service';
import { AuthService } from '../../core/auth/auth.service';
import { AvisosService } from '../../core/services/avisos.service';
import { errorApi } from '../../core/utils/api-error';
import { IconComponent } from '../../shared/components/icon';
import { EstadoComponent } from '../../shared/components/estado';
import { ConfirmarComponent } from '../../shared/components/confirmar';
import { SiPermisoDirective } from '../../shared/directives/si-permiso';
@Component({ standalone: true, imports: [CurrencyPipe, RouterLink, IconComponent, EstadoComponent, ConfirmarComponent, SiPermisoDirective], templateUrl: './servicios-page.html' })
export class ServiciosPage implements OnInit {
  private readonly api = inject(ServicioService);
  private readonly avisos = inject(AvisosService);
  readonly auth = inject(AuthService);
  readonly datos = signal<Servicio[]>([]);
  readonly cargando = signal(true);
  readonly error = signal('');
  readonly busqueda = signal('');
  readonly filtro = signal('todos');
  readonly ocupado = signal(false);
  readonly seleccion = signal<{ item: Servicio; tipo: 'eliminar' | 'estado' } | null>(null);
  readonly activos = computed(() => this.datos().filter(s => s.activo).length);
  readonly resultados = computed(() => {
    const q = this.busqueda().trim().toLowerCase();
    return this.datos().filter(s => (s.nombre.toLowerCase().includes(q) || s.codigo.toLowerCase().includes(q))
      && (this.filtro() === 'todos' || s.activo === (this.filtro() === 'activos')));
  });
  ngOnInit(): void { this.cargar(); }
  cargar(): void {
    this.cargando.set(true); this.error.set('');
    this.api.listar().subscribe({
      next: r => { this.datos.set(r); this.cargando.set(false); },
      error: e => { this.error.set(errorApi(e).mensaje); this.cargando.set(false); },
    });
  }
  buscar(event: Event): void { this.busqueda.set((event.target as HTMLInputElement).value); }
  filtrar(event: Event): void { this.filtro.set((event.target as HTMLSelectElement).value); }
  confirmar(): void {
    const op = this.seleccion();
    if (!op || this.ocupado()) return;
    this.ocupado.set(true);
    const solicitud: Observable<unknown> = op.tipo === 'eliminar' ? this.api.eliminar(op.item.id) : this.api.estado(op.item.id, !op.item.activo);
    solicitud.subscribe({
      next: () => { this.seleccion.set(null); this.ocupado.set(false); this.avisos.mostrar(op.tipo === 'eliminar' ? 'Servicio eliminado correctamente.' : 'Estado del servicio actualizado.'); this.cargar(); },
      error: e => { this.seleccion.set(null); this.ocupado.set(false); this.error.set(errorApi(e).mensaje); },
    });
  }
}
