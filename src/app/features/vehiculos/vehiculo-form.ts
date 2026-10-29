import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { Cliente } from '../../core/models/api.models';
import { ClienteService } from '../../core/services/cliente.service';
import { VehiculoService } from '../../core/services/vehiculo.service';
import { AvisosService } from '../../core/services/avisos.service';
import { errorApi } from '../../core/utils/api-error';
import { IconComponent } from '../../shared/components/icon';
import { FieldErrorComponent } from '../../shared/components/field-error';
import { EstadoComponent } from '../../shared/components/estado';
@Component({ standalone: true, imports: [ReactiveFormsModule, RouterLink, IconComponent, FieldErrorComponent, EstadoComponent], templateUrl: './vehiculo-form.html' })
export class VehiculoFormPage implements OnInit {
  private readonly api = inject(VehiculoService);
  private readonly clientesApi = inject(ClienteService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly avisos = inject(AvisosService);
  readonly id = this.route.snapshot.paramMap.has('id') ? Number(this.route.snapshot.paramMap.get('id')) : null;
  readonly clientes = signal<Cliente[]>([]);
  readonly cargando = signal(true);
  readonly cargaFallida = signal(false);
  readonly guardando = signal(false);
  readonly error = signal('');
  readonly campos = signal<Record<string, string>>({});
  readonly form = new FormGroup({
    placa: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^[A-Z]{3}-[0-9]{3}$/)] }),
    marca: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/\S/), Validators.maxLength(40)] }),
    modelo: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/\S/), Validators.maxLength(40)] }),
    anio: new FormControl<number | null>(null, [Validators.required, Validators.min(1990), Validators.max(2027), Validators.pattern(/^\d+$/)]),
    clienteId: new FormControl<number | null>(null, [Validators.required]),
  });
  ngOnInit(): void { this.cargar(); }
  cargar(): void {
    this.cargando.set(true); this.cargaFallida.set(false); this.error.set('');
    forkJoin({ clientes: this.clientesApi.listar(), vehiculo: this.id === null ? of(null) : this.api.buscar(this.id) }).subscribe({
      next: r => { this.clientes.set(r.clientes); if (r.vehiculo) this.form.patchValue(r.vehiculo); this.cargando.set(false); },
      error: e => { this.error.set(errorApi(e).mensaje); this.cargaFallida.set(true); this.cargando.set(false); },
    });
  }
  guardar(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.guardando()) return;
    const r = this.form.getRawValue();
    if (r.anio === null || r.clienteId === null) return;
    const request = { ...r, placa: r.placa.trim(), marca: r.marca.trim(), modelo: r.modelo.trim(), anio: r.anio, clienteId: r.clienteId };
    this.guardando.set(true); this.error.set(''); this.campos.set({});
    const solicitud = this.id === null ? this.api.crear(request) : this.api.actualizar(this.id, request);
    solicitud.subscribe({
      next: () => { this.avisos.mostrar(this.id === null ? 'Vehículo registrado correctamente.' : 'Vehículo actualizado correctamente.'); void this.router.navigate(['/vehiculos']); },
      error: e => { const r = errorApi(e); this.error.set(r.mensaje); this.campos.set(r.campos); this.guardando.set(false); },
    });
  }
}
