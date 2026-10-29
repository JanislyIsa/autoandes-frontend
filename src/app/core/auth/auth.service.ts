import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Permiso } from '../models/api.models';
import { LoginResponse, Sesion, UsuarioActual } from './auth.model';
import { leerSesion, rutaInterna } from './session-utils';

export const CLAVE_SESION = 'autoandes.sesion';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly actual = signal<Sesion | null>(leerSesion(sessionStorage.getItem(CLAVE_SESION)));
  private temporizador?: ReturnType<typeof setInterval>;
  readonly sesion = this.actual.asReadonly();
  readonly segundosRestantes = signal(0);
  readonly autenticado = computed(() => this.actual() !== null && this.segundosRestantes() > 0);

  constructor() {
    if (this.actual()) this.programar();
    else sessionStorage.removeItem(CLAVE_SESION);
  }

  login(username: string, password: string) {
    return this.http.post<LoginResponse>(environment.apiUrl + '/auth/login', { username, password }).pipe(
      map(r => ({ ...r, username, expiraEn: Date.now() + r.expiraEnSegundos * 1000 })),
      tap(s => this.guardar(s)),
    );
  }

  actualizarUsuario() {
    return this.http.get<UsuarioActual>(environment.apiUrl + '/auth/me').pipe(tap(u => {
      const s = this.actual();
      if (s) this.guardar({ ...s, username: u.username, nombreCompleto: u.nombreCompleto, roles: u.roles, permisos: u.permisos });
    }));
  }

  tiene(permiso: Permiso): boolean { return this.actual()?.permisos.includes(permiso) ?? false; }

  token(): string | null {
    const guardada = leerSesion(sessionStorage.getItem(CLAVE_SESION));
    if (!guardada) {
      if (this.actual()) this.cerrar('expirada', this.router.url);
      return null;
    }
    if (guardada.token !== this.actual()?.token) this.guardar(guardada);
    return guardada.token;
  }

  cerrar(motivo?: 'expirada' | 'invalida', volverA?: string): void {
    if (this.temporizador) clearInterval(this.temporizador);
    this.temporizador = undefined;
    this.actual.set(null);
    this.segundosRestantes.set(0);
    sessionStorage.removeItem(CLAVE_SESION);
    const queryParams: Record<string, string> = {};
    if (motivo) queryParams['motivo'] = motivo;
    if (volverA && !volverA.startsWith('/login')) queryParams['returnUrl'] = rutaInterna(volverA);
    void this.router.navigate(['/login'], { queryParams, replaceUrl: true });
  }

  private guardar(sesion: Sesion): void {
    sessionStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
    this.actual.set(sesion);
    this.programar();
  }

  private programar(): void {
    if (this.temporizador) clearInterval(this.temporizador);
    const actualizar = () => {
      const s = this.actual();
      const restante = s ? Math.max(0, Math.ceil((s.expiraEn - Date.now()) / 1000)) : 0;
      this.segundosRestantes.set(restante);
      if (s && restante === 0) this.cerrar('expirada', this.router.url);
    };
    actualizar();
    if (this.actual()) this.temporizador = setInterval(actualizar, 1000);
  }
}
