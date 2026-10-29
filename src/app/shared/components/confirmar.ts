import { Component, input, output } from '@angular/core';
import { ModalComponent } from './modal';
@Component({ selector: 'app-confirmar', standalone: true, imports: [ModalComponent], template: `
  <app-modal [titulo]="titulo()" (cerrar)="!ocupado() && cancelar.emit()">
    <p class="modal-message">{{ mensaje() }}</p>
    <div class="modal-actions"><button class="btn btn-secondary" type="button" [disabled]="ocupado()" (click)="cancelar.emit()">Cancelar</button>
      <button class="btn" [class.btn-danger]="peligroso()" [class.btn-primary]="!peligroso()" type="button" [disabled]="ocupado()" (click)="confirmar.emit()">@if (ocupado()) { <span class="spinner"></span> }{{ etiqueta() }}</button></div>
  </app-modal>` })
export class ConfirmarComponent {
  readonly titulo = input('Confirmar operación');
  readonly mensaje = input('');
  readonly etiqueta = input('Confirmar');
  readonly ocupado = input(false);
  readonly peligroso = input(false);
  readonly confirmar = output<void>();
  readonly cancelar = output<void>();
}
