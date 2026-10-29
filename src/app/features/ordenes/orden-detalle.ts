import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Orden } from '../../core/models/api.models';
import { OrdenService } from '../../core/services/orden.service';
import { AuthService } from '../../core/auth/auth.service';
import { AvisosService } from '../../core/services/avisos.service';
import { errorApi, hoyLima } from '../../core/utils/api-error';
import { IconComponent } from '../../shared/components/icon';
import { EstadoComponent } from '../../shared/components/estado';
import { AnularOrdenDialog } from './anular-dialog';
@Component({ standalone: true, imports: [CurrencyPipe, DatePipe, DecimalPipe, RouterLink, IconComponent, EstadoComponent, AnularOrdenDialog], templateUrl: './orden-detalle.html' })
export class OrdenDetallePage implements OnInit {
  private readonly api = inject(OrdenService);
  private readonly route = inject(ActivatedRoute);
  private readonly avisos = inject(AvisosService);
  readonly auth = inject(AuthService);
  readonly orden = signal<Orden | null>(null);
  readonly cargando = signal(true);
  readonly error = signal('');
  readonly anulando = signal(false);
  ngOnInit(): void { this.cargar(); }
  cargar(): void {
    this.cargando.set(true); this.error.set('');
    this.api.buscar(Number(this.route.snapshot.paramMap.get('id'))).subscribe({
      next: o => { this.orden.set(o); this.cargando.set(false); },
      error: e => { this.error.set(errorApi(e).mensaje); this.cargando.set(false); },
    });
  }
  puedeAnular(o: Orden): boolean { return this.auth.tiene('ORDEN_ANULAR') && o.estado === 'REGISTRADA' && o.fecha.slice(0, 10) === hoyLima(); }
  anulada(o: Orden): void { this.orden.set(o); this.anulando.set(false); this.avisos.mostrar('Orden ' + o.numero + ' anulada correctamente.'); }
}
