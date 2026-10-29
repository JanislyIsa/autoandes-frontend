import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { Cliente, Vehiculo } from '../../core/models/api.models';
import { ClienteService } from '../../core/services/cliente.service';
import { VehiculoService } from '../../core/services/vehiculo.service';
import { AuthService } from '../../core/auth/auth.service';
import { AvisosService } from '../../core/services/avisos.service';
import { errorApi } from '../../core/utils/api-error';
import { IconComponent } from '../../shared/components/icon';
import { EstadoComponent } from '../../shared/components/estado';
import { ConfirmarComponent } from '../../shared/components/confirmar';
import { SiPermisoDirective } from '../../shared/directives/si-permiso';
@Component({ standalone: true, imports: [RouterLink, IconComponent, EstadoComponent, ConfirmarComponent, SiPermisoDirective], templateUrl: './vehiculos-page.html' })
export class VehiculosPage implements OnInit {
  private readonly api = inject(VehiculoService);
  private readonly clientesApi = inject(ClienteService);
  private readonly avisos = inject(AvisosService);
  private peticion?: Subscription;
  readonly auth = inject(AuthService);
  readonly datos = signal<Vehiculo[]>([]);
  readonly clientes = signal<Cliente[]>([]);
  readonly clienteId = signal<number | undefined>(undefined);
  readonly cargando = signal(true);
  readonly error = signal('');
  readonly busqueda = signal('');
  readonly ocupado = signal(false);
  readonly seleccion = signal<Vehiculo | null>(null);
  readonly resultados = computed(() => {
    const q = this.busqueda().trim().toLowerCase();
    return this.datos().filter(v => [v.placa, v.marca, v.modelo, v.clienteNombre].some(c => c.toLowerCase().includes(q)));
  });
  ngOnInit(): void {
    forkJoin({ clientes: this.clientesApi.listar(), vehiculos: this.api.listar() }).subscribe({
      next: r => { this.clientes.set(r.clientes); this.datos.set(r.vehiculos); this.cargando.set(false); },
      error: e => { this.error.set(errorApi(e).mensaje); this.cargando.set(false); },
    });
  }
  cargar(): void {
    this.peticion?.unsubscribe();
    this.cargando.set(true); this.error.set('');
    this.peticion = this.api.listar(this.clienteId()).subscribe({
      next: r => { this.datos.set(r); this.cargando.set(false); },
      error: e => { this.error.set(errorApi(e).mensaje); this.cargando.set(false); },
    });
  }
  buscar(event: Event): void { this.busqueda.set((event.target as HTMLInputElement).value); }
  filtrar(event: Event): void {
    const valor = (event.target as HTMLSelectElement).value;
    this.clienteId.set(valor ? Number(valor) : undefined); this.cargar();
  }
  eliminar(): void {
    const vehiculo = this.seleccion();
    if (!vehiculo || this.ocupado()) return;
    this.ocupado.set(true);
    this.api.eliminar(vehiculo.id).subscribe({
      next: () => { this.seleccion.set(null); this.ocupado.set(false); this.avisos.mostrar('Vehículo eliminado correctamente.'); this.cargar(); },
      error: e => { this.seleccion.set(null); this.ocupado.set(false); this.error.set(errorApi(e).mensaje); },
    });
  }
}
