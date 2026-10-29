import { Injectable, signal } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class AvisosService {
  readonly mensaje = signal('');
  private temporizador?: ReturnType<typeof setTimeout>;
  mostrar(mensaje: string): void {
    if (this.temporizador) clearTimeout(this.temporizador);
    this.mensaje.set(mensaje);
    this.temporizador = setTimeout(() => this.mensaje.set(''), 7000);
  }
}
