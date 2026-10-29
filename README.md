# AutoAndes Web

SPA con Angular 22 y componentes standalone para el caso del taller AutoAndes.
El diseño toma como referencia el proyecto propio [pharma-frontend](https://github.com/JanislyIsa/pharma-frontend):
encabezado azul, menú blanco, detalles dorados, tablas con cabecera azul y login en tarjeta.

## Ejecutar

Requiere Node.js compatible con Angular 22 (en este equipo se usó Node 24) y el
[backend AutoAndes](https://github.com/JanislyIsa/autoandes-backend) ejecutándose en el puerto 8080.

```powershell
npm install
npm start
```

Abre [http://localhost:4200](http://localhost:4200). También puedes ejecutar `npx ng serve`.
La URL de la API está en `src/environments/environment.ts` y `environment.development.ts`:
`http://localhost:8080/api/v1`. El origen del frontend está habilitado en el CORS del backend.

## Usuarios del ejercicio

Todos usan la contraseña de demostración `Auto2026*`. No se incluyen credenciales de Oracle ni secretos JWT.

| Usuario | Rol | Operaciones |
| --- | --- | --- |
| admin | ADMIN | Todos los permisos |
| asesor | ASESOR | Consulta servicios; mantiene vehículos y registra órdenes |
| jefe | JEFE_TALLER | Mantiene servicios, anula órdenes y consulta reportes |
| inactivo | ASESOR | El backend rechaza el inicio de sesión |

## Funcionalidad

- Servicios: búsqueda por nombre y código, filtro por estado, registro y edición con un formulario único,
  activación/desactivación y eliminación con confirmación.
- Vehículos: lista con nombre de cliente, filtro por cliente enviado a la API y formulario único con clientes
  cargados del backend. Placa ABC-123 y año entre 1990 y 2027.
- Órdenes: vehículo con placa y cliente, kilometraje, 1 a 10 líneas dinámicas sin servicios repetidos y cantidades
  de 1 a 5. El total visible es una estimación; solo se envían vehículo, kilometraje, servicio y cantidad.
  Los precios y el total definitivos los calcula el backend.
- Consulta de órdenes por placa, estado y fechas, detalle completo y anulación con motivo de 10 a 200 caracteres.
- Reporte de ingresos por servicio obtenido de la consulta agregada del backend.
- Estados de carga, vacío y error; mensajes 400 debajo de los campos y mensajes 404/409 visibles.
  Un rechazo al registrar una orden conserva sus líneas.

## Sesión y permisos

`AuthService` usa signals y `sessionStorage` con la clave `autoandes.sesion`.
La sesión se elimina automáticamente al vencer o cerrar sesión.
Un interceptor agrega Bearer únicamente al origen y la raíz de la API; el otro cierra sesión ante 401
y conserva la ruta en `returnUrl`. El 401 del login muestra el error sin iniciar ese recorrido.
Un 403 conserva la sesión.

`authGuard` protege el layout, `invitadoGuard` el login y `permisoGuard` cada ruta de operación.
El menú y los botones se muestran por permiso con `siPermiso`; el backend vuelve a verificarlo.
La ruta `/acceso-denegado` mantiene la sesión y permite continuar usando el menú.

## Estructura

```text
src/app/
  core/auth/           sesión, modelos y utilidades de seguridad
  core/config/         menú por permisos
  core/guards/         sesión, invitado y permiso
  core/interceptors/   Authorization y tratamiento de 401
  core/models/         contrato del backend
  core/services/       un servicio HTTP por recurso
  shared/components/   iconos, errores, estados y diálogos
  shared/directives/   siPermiso
  shared/pages/        acceso denegado y página no encontrada
  layout/              encabezado, menú y router-outlet
  features/            auth, servicios, vehiculos, ordenes, reportes
src/environments/      URL de la API
tests/                  casos de sesión, returnUrl y límites de autenticación
```

Todas las pantallas se cargan de forma diferida con `loadComponent`.
Los catálogos y las listas provienen del backend; no hay servicios simulados ni datos semilla en la SPA.

## Verificar

```powershell
npm test
npm run build
```

Las pruebas unitarias verifican expiración, almacenamiento corrupto, returnUrl, alcance del Bearer
y la diferencia entre 401 y 403. La compilación verifica TypeScript y las plantillas Angular con modo estricto.
Las pruebas en navegador contra Oracle se registran en `docs/verificacion.md`.

## Evidencias

Para la defensa, inicia sesión con los distintos perfiles y demuestra el registro y edición de servicios y vehículos,
la placa duplicada, una orden con varios detalles, el rechazo por kilometraje, el reporte y la ruta denegada.

Para probar un token alterado: modifica el token de `autoandes.sesion` en sessionStorage desde las herramientas
del navegador y recarga una pantalla de datos. La API responderá 401 y la SPA volverá al login con returnUrl.
La sesión se guarda por pestaña, apropiado para los equipos compartidos del caso.

El proyecto se desarrolla en `examen-a-suarez` y se integra en `develop` y `main` para publicación.

La integración final necesita el backend iniciado. [Registro HTTP sin tokens](docs/cierre-autenticacion.json).
