# Verificación de AutoAndes Web

Fecha: 29 de octubre de 2026. Backend real conectado a Oracle, sin datos simulados en Angular.

## Comprobaciones automáticas

- `npm test`: siete pruebas correctas sobre lectura y expiración de sesión, almacenamiento corrupto,
  rutas internas, alcance del encabezado Bearer y distinción de 401/403.
- `npm run build`: compilación de producción con TypeScript y plantillas estrictas, y componentes cargados
  de forma diferida.

## Recorridos observados en el navegador

| Caso | Resultado |
| --- | --- |
| Login ADMIN | Acceso al catálogo con los cuatro módulos y acciones de escritura |
| Servicio nuevo | SRV-910 creado desde el formulario; visible después de consultar el backend |
| Edición de servicio | Precio actualizado de S/ 110.50 a S/ 115.50 |
| Baja de servicio | Confirmación y cambio a Inactivo mediante PATCH |
| Confirmación de eliminación | Diálogo abierto y cancelado, conservando el registro |
| Clientes de vehículos | Lista desplegable cargada con los clientes reales del backend |
| Placa repetida | AAA-111 muestra el mensaje 409 devuelto por el backend |
| Vehículo nuevo y edición | QAQ-910 creado y modelo actualizado desde el mismo formulario |
| Filtro por cliente | Consulta de vehículos del cliente seleccionado |
| Login ASESOR | Sin Reportes ni acciones de escritura de servicios; permite Nueva orden |
| Orden dinámica | Dos líneas; cantidades 2 y 1; total visible S/ 320.00 |
| Kilometraje inválido | El backend informa el mínimo de 45000 y conserva las dos líneas |
| Registro correcto | OS-000007 registrada como asesor; detalle y total confirmado S/ 320.00 |
| Consulta combinada | Placa AAA-111, REGISTRADA y fechas del 29/10/2026 recuperan la orden |
| Login JEFE_TALLER | Nueva orden no aparece en el menú ni en la cabecera |
| URL directa /ordenes/nueva | Acceso denegado; la sesión de jefe continúa |
| Anulación | OS-000007 pasa a ANULADA con el motivo indicado |
| Reporte después de anular | Total baja de S/ 920.00 a S/ 600.00 |
| Usuario inactivo | Mensaje 401 en el login, conservando la pantalla de inicio |
| Ruta inexistente | Página 404 con enlace de regreso al taller |
| Vista móvil | Menú desplegable, formularios adaptados y tablas con desplazamiento interno |
| Consola de la aplicación | Sin errores de JavaScript en los recorridos revisados |

El servicio SRV-910 queda inactivo, el vehículo QAQ-910 queda registrado y la orden de prueba queda ANULADA.
Son registros creados durante esta verificación y conservados como evidencia.

## Alcance

La decisión de cerrar sesión por 401 y conservarla por 403 está probada unitariamente.
La manipulación manual del token en sessionStorage y la espera del vencimiento completo de una hora
no se ejecutaron como recorridos de navegador en esta revisión; el procedimiento para la defensa está en el README.

Las capturas para el PDF del examen se guardan como artefactos locales y no se suben automáticamente al repositorio.
