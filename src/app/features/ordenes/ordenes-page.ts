import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EstadoOrden, Orden } from '../../core/models/api.models';
import { OrdenService } from '../../core/services/orden.service';
import { AuthService } from '../../core/auth/auth.service';
import { AvisosService } from '../../core/services/avisos.service';
import { errorApi, hoyLima } from '../../core/utils/api-error';
import { IconComponent } from '../../shared/components/icon';
import { EstadoComponent } from '../../shared/components/estado';
import { SiPermisoDirective } from '../../shared/directives/si-permiso';
import { AnularOrdenDialog } from './anular-dialog';
@Component({ standalone: true, imports: [CurrencyPipe, DatePipe, DecimalPipe, RouterLink, ReactiveFormsModule, IconComponent, EstadoComponent, SiPermisoDirective, AnularOrdenDialog], templateUrl: './ordenes-page.html' })
export class OrdenesPage implements OnInit {
  private readonly api = inject(OrdenService);
  private readonly avisos = inject(AvisosService);
  private peticion?: Subscription;
  readonly auth = inject(AuthService);
  readonly datos = signal<Orden[]>([]);
  readonly cargando = signal(true);
  readonly error = signal('');
  readonly seleccion = signal<Orden | null>(null);
  readonly registradas = computed(() => this.datos().filter(o => o.estado === 'REGISTRADA').length);
  readonly total = computed(() => this.datos().filter(o => o.estado === 'REGISTRADA').reduce((n, o) => n + o.total, 0));
  readonly form = new FormGroup({
    placa: new FormControl('', { nonNullable: true }),
    estado: new FormControl<EstadoOrden | ''>('', { nonNullable: true }),
    desde: new FormControl('', { nonNullable: true }),
    hasta: new FormControl('', { nonNullable: true }),
  });
  ngOnInit(): void { this.cargar(); }
  cargar(): void {
    const filtros = this.form.getRawValue();
    if (filtros.desde && filtros.hasta && filtros.desde > filtros.hasta) { this.error.set('La fecha desde no puede ser posterior a hasta.'); return; }
    this.peticion?.unsubscribe(); this.cargando.set(true); this.error.set('');
    this.peticion = this.api.listar({ ...filtros, placa: filtros.placa.trim() }).subscribe({
      next: r => { this.datos.set(r); this.cargando.set(false); },
      error: e => { this.error.set(errorApi(e).mensaje); this.cargando.set(false); },
    });
  }
  limpiar(): void { this.form.reset({ placa: '', estado: '', desde: '', hasta: '' }); this.cargar(); }
  puedeAnular(o: Orden): boolean { return this.auth.tiene('ORDEN_ANULAR') && o.estado === 'REGISTRADA' && o.fecha.slice(0, 10) === hoyLima(); }
  anulada(o: Orden): void { this.seleccion.set(null); this.avisos.mostrar('Orden ' + o.numero + ' anulada correctamente.'); this.cargar(); }
}
