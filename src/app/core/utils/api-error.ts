import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from '../models/api.models';
export function errorApi(error: unknown): { mensaje: string; campos: Record<string, string> } {
  if (error instanceof HttpErrorResponse) {
    const datos = error.error as Partial<ApiError> | null;
    return { mensaje: datos?.mensaje || (error.status === 0 ? 'No se pudo conectar con el servidor. Intenta de nuevo.' : 'No se pudo completar la operación.'), campos: datos?.campos ?? {} };
  }
  return { mensaje: 'No se pudo completar la operación.', campos: {} };
}
export function hoyLima(): string { return new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Lima' }).format(new Date()); }
