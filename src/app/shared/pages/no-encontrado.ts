import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ standalone: true, imports: [RouterLink], template: '<section class="page"><div class="result-page panel"><span class="error-number">404</span><h1>No encontramos esta página</h1><p>Revisa la dirección o vuelve a las opciones de tu taller.</p><a class="btn btn-primary" routerLink="/servicios">Volver al taller</a></div></section>' })
export class NoEncontradoPage {}
