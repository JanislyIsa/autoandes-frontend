import { Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
@Component({ selector: 'app-field-error', standalone: true, template: '@if (mensaje()) { <small class="field-error" role="alert">{{ mensaje() }}</small> }' })
export class FieldErrorComponent {
  readonly control = input<AbstractControl | null>(null);
  readonly campo = input('');
  readonly backend = input<Record<string, string>>({});
  readonly patron = input('Revisa el formato del campo.');
  mensaje(): string {
    const remoto = this.backend()[this.campo()];
    if (remoto) return remoto;
    const c = this.control();
    if (!c || !c.invalid || (!c.touched && !c.dirty)) return '';
    const e = c.errors ?? {};
    if (e['required']) return 'Este campo es obligatorio.';
    if (e['minlength']) return 'Ingresa al menos ' + e['minlength'].requiredLength + ' caracteres.';
    if (e['maxlength']) return 'Máximo ' + e['maxlength'].requiredLength + ' caracteres.';
    if (e['min']) return 'El valor mínimo es ' + e['min'].min + '.';
    if (e['max']) return 'El valor máximo es ' + e['max'].max + '.';
    if (e['pattern']) return this.patron();
    return 'Revisa este campo.';
  }
}
