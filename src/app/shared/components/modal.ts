import { AfterViewInit, Component, ElementRef, input, output, viewChild } from '@angular/core';
import { IconComponent } from './icon';
@Component({ selector: 'app-modal', standalone: true, imports: [IconComponent], template: `
  <dialog #dialog class="modal" aria-labelledby="modal-title" (cancel)="$event.preventDefault(); cerrar.emit()">
    <header class="modal-header"><h2 id="modal-title">{{ titulo() }}</h2><button type="button" class="icon-btn" aria-label="Cerrar ventana" (click)="cerrar.emit()"><app-icon name="close" /></button></header>
    <ng-content />
  </dialog>` })
export class ModalComponent implements AfterViewInit {
  readonly titulo = input.required<string>();
  readonly cerrar = output<void>();
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  ngAfterViewInit(): void { this.dialog().nativeElement.showModal(); }
}
