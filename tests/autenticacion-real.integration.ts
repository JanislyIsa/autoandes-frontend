import '@angular/compiler';
import { strict as assert } from 'node:assert';
import { writeFileSync, mkdirSync } from 'node:fs';
import { Injector, runInInjectionContext } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpRequest, HttpResponse, HttpHandlerFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { defer, firstValueFrom } from 'rxjs';
import { AuthService, CLAVE_SESION } from '../src/app/core/auth/auth.service';
import { authInterceptor } from '../src/app/core/interceptors/auth.interceptor';
import { errorInterceptor } from '../src/app/core/interceptors/error.interceptor';
import { environment } from '../src/environments/environment';

const memoria = new Map<string, string>();
const storage = { getItem: (k: string) => memoria.get(k) ?? null, setItem: (k: string, v: string) => memoria.set(k, v), removeItem: (k: string) => memoria.delete(k) };
Object.defineProperty(globalThis, 'sessionStorage', { value: storage, configurable: true });
const navegaciones: Array<{ commands: unknown; options: any }> = [];
const router = { url: '/ordenes', navigate: (commands: unknown, options: any) => { navegaciones.push({ commands, options }); return Promise.resolve(true); } };
const peticiones: any[] = [];
const http = {
  post: (url: string, body: unknown) => defer(async () => {
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const datos = await r.json();
    if (!r.ok) throw new HttpErrorResponse({ status: r.status, error: datos, url });
    return datos;
  }),
};
const base = Injector.create({ providers: [{ provide: HttpClient, useValue: http }, { provide: Router, useValue: router }] });
const auth = runInInjectionContext(base, () => new AuthService());
const contexto = Injector.create({ providers: [{ provide: AuthService, useValue: auth }, { provide: Router, useValue: router }] });
const terminal: HttpHandlerFn = req => defer(async () => {
  const headers: Record<string, string> = {};
  for (const key of req.headers.keys()) headers[key] = req.headers.get(key)!;
  const r = await fetch(req.urlWithParams, { method: req.method, headers });
  const datos = await r.json();
  peticiones.push({ metodo: req.method, ruta: new URL(req.urlWithParams).pathname, status: r.status, respuesta: datos });
  if (!r.ok) throw new HttpErrorResponse({ status: r.status, statusText: r.statusText, error: datos, url: req.url });
  return new HttpResponse({ status: r.status, body: datos, url: req.url });
});
function get(ruta: string) {
  return runInInjectionContext(contexto, () => firstValueFrom(authInterceptor(
    new HttpRequest('GET', environment.apiUrl + ruta), req => errorInterceptor(req, terminal),
  )));
}
const casos: any[] = [];
const ahora = Date.now;
try {
  const sesion = await firstValueFrom(auth.login('asesor', 'Auto2026*'));
  assert.equal(sesion.expiraEnSegundos, 3600);
  const alterada = JSON.parse(storage.getItem(CLAVE_SESION)!);
  const partes = alterada.token.split('.');
  partes[2] = (partes[2][0] === 'a' ? 'b' : 'a') + partes[2].slice(1);
  alterada.token = partes.join('.');
  storage.setItem(CLAVE_SESION, JSON.stringify(alterada));
  await assert.rejects(get('/clientes'), (e: any) => e.status === 401);
  assert.equal(auth.sesion(), null);
  assert.equal(storage.getItem(CLAVE_SESION), null);
  assert.deepEqual(navegaciones.at(-1)?.commands, ['/login']);
  assert.equal(navegaciones.at(-1)?.options.queryParams.returnUrl, '/ordenes');
  casos.push({ caso: 'Token alterado', resultado: '401 real; sesión eliminada; navegación al login con returnUrl', navegacion: navegaciones.at(-1) });

  await firstValueFrom(auth.login('asesor', 'Auto2026*'));
  const antes = navegaciones.length;
  await assert.rejects(get('/reportes/ingresos-por-servicio'), (e: any) => e.status === 403);
  assert.ok(auth.sesion());
  assert.ok(storage.getItem(CLAVE_SESION));
  assert.equal(navegaciones.length, antes);
  casos.push({ caso: 'Permiso insuficiente', resultado: '403 real; sesión conservada; sin navegación al login' });

  Date.now = () => ahora() + 3601000;
  await new Promise(resolve => setTimeout(resolve, 1250));
  assert.equal(auth.sesion(), null);
  assert.equal(storage.getItem(CLAVE_SESION), null);
  assert.equal(navegaciones.at(-1)?.options.queryParams.motivo, 'expirada');
  casos.push({ caso: 'Vencimiento', resultado: 'Temporizador real de AuthService elimina la sesión; reloj de prueba adelantado 3601 segundos', navegacion: navegaciones.at(-1) });
  mkdirSync('tmp', { recursive: true });
  writeFileSync('tmp/cierre-autenticacion.json', JSON.stringify({
    fecha: new Date(ahora()).toISOString(), tipo: 'Integración de AuthService e interceptores reales con HTTP real. Almacenamiento y Router controlados en Node; no es una prueba de interfaz de navegador.',
    casos, peticiones,
  }, null, 2));
  console.log('3 casos de integración correctos: token alterado, 403 y vencimiento.');
  console.log('Respuestas HTTP reales guardadas sin tokens en tmp/cierre-autenticacion.json');
} finally {
  Date.now = ahora;
  auth.cerrar();
}
