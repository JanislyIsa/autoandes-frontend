import { Component, inject, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Orden } from '../../core/models/api.models';
import { OrdenService } from '../../core/services/orden.service';
import { errorApi } from '../../core/utils/api-error';
import { ModalComponent } from '../../shared/components/modal';
import { FieldErrorComponent } from '../../shared/components/field-error';
@Component({ selector: 'app-anular-orden', standalone: true, imports: [ReactiveFormsModule, ModalComponent, FieldErrorComponent], template: `
  <app-modal [titulo]="'Anular orden ' + orden().numero" (cerrar)="!ocupado() && cerrar.emit()">
    <form [formGroup]="form" (ngSubmit)="guardar()" novalidate><div class="modal-body">
      <p class="field-hint">La orden se conservará en el historial y dejará de incluirse en los ingresos.</p>
      @if (error()) { <div class="alert alert-error" role="alert">{{ error() }}</div> }
      <div class="field"><label for="motivo">Motivo de anulación</label><textarea id="motivo" formControlName="motivo" minlength="10" maxlength="200" placeholder="Describe el motivo de la anulación…"></textarea><span class="field-hint">Entre 10 y 200 caracteres.</span><app-field-error [control]="form.controls.motivo" campo="motivo" [backend]="campos()" /></div>
    </div><div class="modal-actions"><button class="btn btn-secondary" type="button" [disabled]="ocupado()" (click)="cerrar.emit()">Cancelar</button><button class="btn btn-danger" type="submit" [disabled]="ocupado()">@if (ocupado()) { <span class="spinner"></span> }{{ ocupado() ? 'Anulando…' : 'Anular orden' }}</button></div></form>
  </app-modal>` })
export class AnularOrdenDialog {
  readonly orden = input.required<Orden>();
  readonly cerrar = output<void>();
  readonly anulado = output<Orden>();
  private readonly api = inject(OrdenService);
  readonly ocupado = signal(false);
  readonly error = signal('');
  readonly campos = signal<Record<string, string>>({});
  readonly form = new FormGroup({ motivo: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(10), Validators.maxLength(200)] }) });
  guardar(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.ocupado()) return;
    const motivo = this.form.controls.motivo.value.trim();
    if (motivo.length < 10) { this.error.set('El motivo debe tener entre 10 y 200 caracteres.'); return; }
    this.ocupado.set(true); this.error.set(''); this.campos.set({});
    this.api.anular(this.orden().id, motivo).subscribe({
      next: r => this.anulado.emit(r),
      error: e => { const r = errorApi(e); this.error.set(r.mensaje); this.campos.set(r.campos); this.ocupado.set(false); },
    });
  }
}
