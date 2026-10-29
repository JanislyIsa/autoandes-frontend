import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { invitadoGuard } from './core/guards/invitado.guard';
import { permisoGuard } from './core/guards/permiso.guard';
export const routes: Routes = [
  { path: 'login', canActivate: [invitadoGuard], loadComponent: () => import('./features/auth/login').then(m => m.LoginPage) },
  { path: '', canActivate: [authGuard], loadComponent: () => import('./layout/main-layout').then(m => m.MainLayout), children: [
    { path: '', pathMatch: 'full', redirectTo: 'servicios' },
    { path: 'servicios', canActivate: [permisoGuard], data: { permiso: 'SERVICIO_LEER' }, loadComponent: () => import('./features/servicios/servicios-page').then(m => m.ServiciosPage) },
    { path: 'servicios/nuevo', canActivate: [permisoGuard], data: { permiso: 'SERVICIO_ESCRIBIR' }, loadComponent: () => import('./features/servicios/servicio-form').then(m => m.ServicioFormPage) },
    { path: 'servicios/:id/editar', canActivate: [permisoGuard], data: { permiso: 'SERVICIO_ESCRIBIR' }, loadComponent: () => import('./features/servicios/servicio-form').then(m => m.ServicioFormPage) },
    { path: 'vehiculos', canActivate: [permisoGuard], data: { permiso: 'VEHICULO_LEER' }, loadComponent: () => import('./features/vehiculos/vehiculos-page').then(m => m.VehiculosPage) },
    { path: 'vehiculos/nuevo', canActivate: [permisoGuard], data: { permiso: 'VEHICULO_ESCRIBIR' }, loadComponent: () => import('./features/vehiculos/vehiculo-form').then(m => m.VehiculoFormPage) },
    { path: 'vehiculos/:id/editar', canActivate: [permisoGuard], data: { permiso: 'VEHICULO_ESCRIBIR' }, loadComponent: () => import('./features/vehiculos/vehiculo-form').then(m => m.VehiculoFormPage) },
    { path: 'ordenes', canActivate: [permisoGuard], data: { permiso: 'ORDEN_LEER' }, loadComponent: () => import('./features/ordenes/ordenes-page').then(m => m.OrdenesPage) },
    { path: 'ordenes/nueva', canActivate: [permisoGuard], data: { permiso: 'ORDEN_REGISTRAR' }, loadComponent: () => import('./features/ordenes/orden-form').then(m => m.OrdenFormPage) },
    { path: 'ordenes/:id', canActivate: [permisoGuard], data: { permiso: 'ORDEN_LEER' }, loadComponent: () => import('./features/ordenes/orden-detalle').then(m => m.OrdenDetallePage) },
    { path: 'reportes', canActivate: [permisoGuard], data: { permiso: 'REPORTE_VER' }, loadComponent: () => import('./features/reportes/reportes-page').then(m => m.ReportesPage) },
    { path: 'acceso-denegado', loadComponent: () => import('./shared/pages/acceso-denegado').then(m => m.AccesoDenegadoPage) },
    { path: '**', loadComponent: () => import('./shared/pages/no-encontrado').then(m => m.NoEncontradoPage) },
  ] },
];
