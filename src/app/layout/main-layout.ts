import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../core/auth/auth.service';
import { MENU } from '../core/config/menu';
import { AvisosService } from '../core/services/avisos.service';
import { IconComponent } from '../shared/components/icon';
import { SiPermisoDirective } from '../shared/directives/si-permiso';
@Component({ standalone: true, imports: [RouterOutlet, RouterLink, RouterLinkActive, IconComponent, SiPermisoDirective], templateUrl: './main-layout.html' })
export class MainLayout implements OnInit {
  readonly auth = inject(AuthService);
  readonly avisos = inject(AvisosService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  readonly abierto = signal(false);
  readonly ruta = signal(this.router.url);
  readonly menu = computed(() => MENU.filter(item => this.auth.tiene(item.permiso)));
  readonly titulo = computed(() => MENU.find(item => this.ruta().startsWith(item.ruta))?.titulo ?? 'Tu taller');
  readonly iniciales = computed(() => (this.auth.sesion()?.nombreCompleto ?? 'AA').split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase());
  constructor() {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd), takeUntilDestroyed(this.destroyRef)).subscribe(e => {
      this.ruta.set(e.urlAfterRedirects); this.abierto.set(false);
    });
  }
  ngOnInit(): void { this.auth.actualizarUsuario().subscribe({ error: () => {} }); }
}
