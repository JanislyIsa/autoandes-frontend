import { Component, input, output } from '@angular/core';
import { IconComponent } from './icon';
@Component({ selector: 'app-estado', standalone: true, imports: [IconComponent], template: `
  <div class="empty-state" [attr.role]="tipo() === 'loading' ? 'status' : null">
    @if (tipo() === 'loading') { <span class="spinner large"></span><h2>Cargando información</h2><p>Un momento, estamos preparando los datos.</p> }
    @else { <span class="empty-icon"><app-icon [name]="tipo() === 'error' ? 'alert' : 'search'" /></span><h2>{{ titulo() }}</h2><p>{{ mensaje() }}</p>
      @if (tipo() === 'error') { <button class="btn btn-secondary" type="button" (click)="reintentar.emit()">Intentar de nuevo</button> }
    }
  </div>` })
export class EstadoComponent {
  readonly tipo = input<'loading' | 'empty' | 'error'>('empty');
  readonly titulo = input('No hay resultados');
  readonly mensaje = input('Prueba con otros filtros o registra un nuevo elemento.');
  readonly reintentar = output<void>();
}
