export type Permiso = 'SERVICIO_LEER' | 'SERVICIO_ESCRIBIR' | 'VEHICULO_LEER' | 'VEHICULO_ESCRIBIR' | 'ORDEN_LEER' | 'ORDEN_REGISTRAR' | 'ORDEN_ANULAR' | 'REPORTE_VER';
export interface ApiError { timestamp: string; status: number; error: string; mensaje: string; ruta: string; campos?: Record<string, string>; }
export interface Cliente { id: number; documento: string; nombres: string; telefono: string | null; }
export interface ServicioRequest { codigo: string; nombre: string; precio: number; duracionMin: number; activo: boolean; }
export interface Servicio extends ServicioRequest { id: number; }
export interface VehiculoRequest { placa: string; marca: string; modelo: string; anio: number; clienteId: number; }
export interface Vehiculo extends VehiculoRequest { id: number; clienteNombre: string; }
export type EstadoOrden = 'REGISTRADA' | 'ANULADA';
export interface DetalleRequest { servicioId: number; cantidad: number; }
export interface OrdenRequest { vehiculoId: number; kilometraje: number; detalles: DetalleRequest[]; }
export interface DetalleOrden extends DetalleRequest { id: number; codigo: string; servicio: string; precioUnitario: number; subtotal: number; }
export interface Orden { id: number; numero: string; fecha: string; vehiculoId: number; placa: string; clienteNombre: string; kilometraje: number; estado: EstadoOrden; total: number; usuarioRegistro: string; motivoAnulacion: string | null; detalles: DetalleOrden[]; }
export interface FiltrosOrden { placa?: string; estado?: EstadoOrden | ''; desde?: string; hasta?: string; }
export interface IngresoServicio { codigo: string; servicio: string; cantidadTotal: number; importeTotal: number; }
