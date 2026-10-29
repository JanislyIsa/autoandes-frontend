import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../components/icon';
@Component({ standalone: true, imports: [RouterLink, IconComponent], template: `
  <section class="page"><div class="result-page panel"><span class="result-symbol"><app-icon name="shield" /></span><span class="eyebrow">PERMISOS DE TU CUENTA</span><h1>Acceso denegado</h1><p>Tu cuenta no tiene permiso para realizar esta operación.<br>Puedes continuar con las opciones disponibles en tu menú.</p><a class="btn btn-primary" routerLink="/servicios"><app-icon name="back" /> Volver al taller</a></div></section>` })
export class AccesoDenegadoPage {}
