import type { Permiso } from '../models/api.models';
export interface LoginResponse { token: string; tipo: string; expiraEnSegundos: number; nombreCompleto: string; roles: string[]; permisos: Permiso[]; }
export interface Sesion extends LoginResponse { username: string; expiraEn: number; }
export interface UsuarioActual { id: number; username: string; nombreCompleto: string; roles: string[]; permisos: Permiso[]; }
