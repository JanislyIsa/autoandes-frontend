import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ServicioService } from '../../core/services/servicio.service';
import { AvisosService } from '../../core/services/avisos.service';
import { errorApi } from '../../core/utils/api-error';
import { IconComponent } from '../../shared/components/icon';
import { FieldErrorComponent } from '../../shared/components/field-error';
import { EstadoComponent } from '../../shared/components/estado';
@Component({ standalone: true, imports: [ReactiveFormsModule, RouterLink, IconComponent, FieldErrorComponent, EstadoComponent], templateUrl: './servicio-form.html' })
export class ServicioFormPage implements OnInit {
  private readonly api = inject(ServicioService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly avisos = inject(AvisosService);
  readonly id = this.route.snapshot.paramMap.has('id') ? Number(this.route.snapshot.paramMap.get('id')) : null;
  readonly cargando = signal(false);
  readonly cargaFallida = signal(false);
  readonly guardando = signal(false);
  readonly error = signal('');
  readonly campos = signal<Record<string, string>>({});
  readonly form = new FormGroup({
    codigo: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^SRV-[0-9]{3}$/)] }),
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/\S/), Validators.minLength(3), Validators.maxLength(80)] }),
    precio: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01), Validators.max(99999999.99), Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
    duracionMin: new FormControl<number | null>(null, [Validators.required, Validators.min(15), Validators.max(480), Validators.pattern(/^\d+$/)]),
    activo: new FormControl(true, { nonNullable: true }),
  });
  ngOnInit(): void { this.cargar(); }
  cargar(): void {
    if (this.id === null) return;
    this.cargando.set(true); this.cargaFallida.set(false); this.error.set('');
    this.api.buscar(this.id).subscribe({
      next: s => { this.form.patchValue(s); this.cargando.set(false); },
      error: e => { this.error.set(errorApi(e).mensaje); this.cargaFallida.set(true); this.cargando.set(false); },
    });
  }
  guardar(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.guardando()) return;
    const r = this.form.getRawValue();
    if (r.precio === null || r.duracionMin === null) return;
    const request = { ...r, nombre: r.nombre.trim(), precio: r.precio, duracionMin: r.duracionMin };
    this.guardando.set(true); this.error.set(''); this.campos.set({});
    const solicitud = this.id === null ? this.api.crear(request) : this.api.actualizar(this.id, request);
    solicitud.subscribe({
      next: () => { this.avisos.mostrar(this.id === null ? 'Servicio registrado correctamente.' : 'Servicio actualizado correctamente.'); void this.router.navigate(['/servicios']); },
      error: e => { const r = errorApi(e); this.error.set(r.mensaje); this.campos.set(r.campos); this.guardando.set(false); },
    });
  }
}
