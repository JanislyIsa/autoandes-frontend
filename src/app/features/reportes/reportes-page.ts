import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IngresoServicio } from '../../core/models/api.models';
import { ReporteService } from '../../core/services/reporte.service';
import { errorApi, hoyLima } from '../../core/utils/api-error';
import { IconComponent } from '../../shared/components/icon';
import { EstadoComponent } from '../../shared/components/estado';
@Component({ standalone: true, imports: [CurrencyPipe, DecimalPipe, ReactiveFormsModule, IconComponent, EstadoComponent], templateUrl: './reportes-page.html' })
export class ReportesPage implements OnInit {
  private readonly api = inject(ReporteService);
  private peticion?: Subscription;
  readonly datos = signal<IngresoServicio[]>([]);
  readonly cargando = signal(true);
  readonly error = signal('');
  readonly total = computed(() => this.datos().reduce((n, d) => n + d.importeTotal, 0));
  readonly cantidad = computed(() => this.datos().reduce((n, d) => n + d.cantidadTotal, 0));
  readonly maximo = computed(() => Math.max(1, ...this.datos().map(d => d.importeTotal)));
  readonly form = new FormGroup({
    desde: new FormControl(hoyLima().slice(0, 8) + '01', { nonNullable: true }),
    hasta: new FormControl(hoyLima(), { nonNullable: true }),
  });
  ngOnInit(): void { this.cargar(); }
  cargar(): void {
    const r = this.form.getRawValue();
    if (r.desde && r.hasta && r.desde > r.hasta) { this.error.set('La fecha desde no puede ser posterior a hasta.'); return; }
    this.peticion?.unsubscribe(); this.cargando.set(true); this.error.set('');
    this.peticion = this.api.ingresos(r.desde, r.hasta).subscribe({
      next: datos => { this.datos.set(datos); this.cargando.set(false); },
      error: e => { this.error.set(errorApi(e).mensaje); this.cargando.set(false); },
    });
  }
}
