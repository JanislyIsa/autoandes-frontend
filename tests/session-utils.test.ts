import test from 'node:test';
import assert from 'node:assert/strict';
import { debeCerrarSesion, esUrlApi, leerSesion, rutaInterna } from '../src/app/core/auth/session-utils.ts';

const api = 'http://localhost:8080/api/v1';
const sesion = { token: 'token-de-prueba', username: 'asesor', nombreCompleto: 'Asesor de prueba', expiraEn: 2000, roles: ['ASESOR'], permisos: ['ORDEN_LEER'] };

test('recupera una sesión vigente sin alterar los permisos', () => {
  const recuperada = leerSesion(JSON.stringify(sesion), 1000);
  assert.equal(recuperada?.username, 'asesor');
  assert.deepEqual(recuperada?.permisos, ['ORDEN_LEER']);
});

test('rechaza la sesión al alcanzar su vencimiento exacto', () => {
  assert.equal(leerSesion(JSON.stringify(sesion), 2000), null);
  assert.equal(leerSesion(JSON.stringify(sesion), 3000), null);
});

test('rechaza almacenamiento vacío, JSON corrupto y estructuras incompletas', () => {
  for (const raw of [null, '', '{', '{}', 'null', '[]', JSON.stringify({ ...sesion, token: '' }),
    JSON.stringify({ ...sesion, permisos: 'ADMIN' }), JSON.stringify({ ...sesion, roles: [1] }),
    JSON.stringify({ ...sesion, expiraEn: '2000' })]) {
    assert.equal(leerSesion(raw, 1000), null);
  }
});

test('returnUrl conserva rutas internas y rechaza destinos externos', () => {
  assert.equal(rutaInterna('/ordenes/nueva?origen=menu'), '/ordenes/nueva?origen=menu');
  for (const ruta of [null, '', 'https://example.org', '//example.org', '/\\example.org', 'javascript:alert(1)']) {
    assert.equal(rutaInterna(ruta), '/servicios');
  }
});

test('Authorization se limita al origen y la raíz exactos de la API', () => {
  assert.equal(esUrlApi(api + '/ordenes?estado=REGISTRADA', api), true);
  assert.equal(esUrlApi(api + '?filtro=1', api), true);
  for (const url of ['http://localhost:8080/api/v10/clientes', 'http://localhost:8080/api/v1-otra',
    'http://localhost:8080/api/v1/../publico', 'http://localhost:4200/api/v1/clientes',
    'https://example.org/api/v1/clientes', '/assets/favicon.svg', 'no-es-url']) {
    assert.equal(esUrlApi(url, api), false, url);
  }
});

test('un 401 de la API termina la sesión; un 403 la conserva', () => {
  assert.equal(debeCerrarSesion(401, api + '/ordenes', api), true);
  assert.equal(debeCerrarSesion(403, api + '/ordenes', api), false);
  assert.equal(debeCerrarSesion(409, api + '/ordenes', api), false);
});

test('el 401 del login y los errores ajenos a la API no cierran la sesión', () => {
  assert.equal(debeCerrarSesion(401, api + '/auth/login', api), false);
  assert.equal(debeCerrarSesion(401, api + '/auth/login?origen=web', api), false);
  assert.equal(debeCerrarSesion(401, 'https://example.org/clientes', api), false);
});
