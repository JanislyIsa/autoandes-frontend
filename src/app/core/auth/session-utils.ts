import type { Sesion } from './auth.model';

export function rutaInterna(ruta: string | null | undefined): string {
  return ruta && ruta.startsWith('/') && !ruta.startsWith('//') && !ruta.includes('\\')
    ? ruta : '/servicios';
}

export function esUrlApi(url: string, apiUrl: string): boolean {
  try {
    const objetivo = new URL(url);
    const base = new URL(apiUrl);
    const raiz = base.pathname.replace(/\/$/, '');
    return objetivo.origin === base.origin && (objetivo.pathname === raiz || objetivo.pathname.startsWith(raiz + '/'));
  } catch { return false; }
}

export function debeCerrarSesion(status: number, url: string, apiUrl: string): boolean {
  return status === 401 && esUrlApi(url, apiUrl) && url.split('?')[0] !== apiUrl + '/auth/login';
}

export function leerSesion(texto: string | null, ahora = Date.now()): Sesion | null {
  if (!texto) return null;
  try {
    const s = JSON.parse(texto) as Partial<Sesion>;
    if (typeof s.token !== 'string' || !s.token || typeof s.expiraEn !== 'number'
        || !Number.isFinite(s.expiraEn) || s.expiraEn <= ahora
        || typeof s.username !== 'string' || typeof s.nombreCompleto !== 'string'
        || !Array.isArray(s.roles) || !s.roles.every(r => typeof r === 'string')
        || !Array.isArray(s.permisos) || !s.permisos.every(p => typeof p === 'string')) return null;
    return s as Sesion;
  } catch { return null; }
}
