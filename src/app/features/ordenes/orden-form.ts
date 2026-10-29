import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Servicio, Vehiculo, OrdenRequest } from '../../core/models/api.models';
import { ServicioService } from '../../core/services/servicio.service';
import { VehiculoService } from '../../core/services/vehiculo.service';
import { OrdenService } from '../../core/services/orden.service';
import { AvisosService } from '../../core/services/avisos.service';
import { errorApi } from '../../core/utils/api-error';
import { IconComponent } from '../../shared/components/icon';
import { FieldErrorComponent } from '../../shared/components/field-error';
import { EstadoComponent } from '../../shared/components/estado';
type Linea = FormGroup<{ servicioId: FormControl<number | null>; cantidad: FormControl<number> }>;
@Component({ standalone: true, imports: [CurrencyPipe, ReactiveFormsModule, RouterLink, IconComponent, FieldErrorComponent, EstadoComponent], templateUrl: './orden-form.html' })
export class OrdenFormPage implements OnInit {
  private readonly serviciosApi = inject(ServicioService);
  private readonly vehiculosApi = inject(VehiculoService);
  private readonly ordenesApi = inject(OrdenService);
  private readonly avisos = inject(AvisosService);
  private readonly router = inject(Router);
  readonly servicios = signal<Servicio[]>([]);
  readonly vehiculos = signal<Vehiculo[]>([]);
  readonly cargando = signal(true);
  readonly cargaFallida = signal(false);
  readonly guardando = signal(false);
  readonly error = signal('');
  readonly campos = signal<Record<string, string>>({});
  readonly detalles = new FormArray<Linea>([]);
  readonly form = new FormGroup({
    vehiculoId: new FormControl<number | null>(null, Validators.required),
    kilometraje: new FormControl<number | null>(null, [Validators.required, Validators.min(0), Validators.max(9999999), Validators.pattern(/^\d+$/)]),
    detalles: this.detalles,
  });
  constructor() { this.agregar(); }
  ngOnInit(): void { this.cargar(); }
  cargar(): void {
    this.cargando.set(true); this.cargaFallida.set(false); this.error.set('');
    forkJoin({ servicios: this.serviciosApi.listar(), vehiculos: this.vehiculosApi.listar() }).subscribe({
      next: r => { this.servicios.set(r.servicios.filter(s => s.activo)); this.vehiculos.set(r.vehiculos); this.cargando.set(false); },
      error: e => { this.error.set(errorApi(e).mensaje); this.cargaFallida.set(true); this.cargando.set(false); },
    });
  }
  agregar(): void {
    if (this.detalles.length >= 10) return;
    this.detalles.push(new FormGroup({
      servicioId: new FormControl<number | null>(null, Validators.required),
      cantidad: new FormControl(1, { nonNullable: true, validators: [Validators.required, Validators.min(1), Validators.max(5), Validators.pattern(/^\d+$/)] }),
    }));
  }
  quitar(i: number): void { if (this.detalles.length > 1) this.detalles.removeAt(i); }
  repetido(id: number, fila: number): boolean { return this.detalles.controls.some((c, i) => i !== fila && c.controls.servicioId.value === id); }
  precio(i: number): number { return this.servicios().find(s => s.id === this.detalles.at(i).controls.servicioId.value)?.precio ?? 0; }
  subtotal(i: number): number { return this.precio(i) * Math.max(0, this.detalles.at(i).controls.cantidad.value || 0); }
  total(): number { return this.detalles.controls.reduce((n, _c, i) => n + this.subtotal(i), 0); }
  registrar(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.guardando()) return;
    const r = this.form.getRawValue();
    if (r.vehiculoId === null || r.kilometraje === null) return;
    const detalles = r.detalles.filter((d): d is { servicioId: number; cantidad: number } => d.servicioId !== null);
    if (new Set(detalles.map(d => d.servicioId)).size !== detalles.length) { this.error.set('No se puede repetir un servicio en la orden.'); return; }
    const request: OrdenRequest = { vehiculoId: r.vehiculoId, kilometraje: r.kilometraje, detalles };
    this.guardando.set(true); this.error.set(''); this.campos.set({});
    this.ordenesApi.registrar(request).subscribe({
      next: orden => { this.avisos.mostrar('Orden ' + orden.numero + ' registrada correctamente.'); void this.router.navigate(['/ordenes', orden.id]); },
      error: e => { const r = errorApi(e); this.error.set(r.mensaje); this.campos.set(r.campos); this.guardando.set(false); },
    });
  }
}
