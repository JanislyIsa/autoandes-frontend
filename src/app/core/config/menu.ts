import { Permiso } from '../models/api.models';
export interface MenuItem { titulo: string; ruta: string; icono: string; permiso: Permiso; }
export const MENU: MenuItem[] = [
  { titulo: 'Servicios', ruta: '/servicios', icono: 'wrench', permiso: 'SERVICIO_LEER' },
  { titulo: 'Vehículos', ruta: '/vehiculos', icono: 'car', permiso: 'VEHICULO_LEER' },
  { titulo: 'Órdenes de servicio', ruta: '/ordenes', icono: 'clipboard', permiso: 'ORDEN_LEER' },
  { titulo: 'Reportes', ruta: '/reportes', icono: 'chart', permiso: 'REPORTE_VER' },
];
