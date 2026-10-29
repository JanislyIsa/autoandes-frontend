import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { FiltrosOrden, Orden, OrdenRequest } from '../models/api.models';
@Injectable({ providedIn: 'root' })
export class OrdenService {
  private readonly http = inject(HttpClient);
  private readonly url = environment.apiUrl + '/ordenes';
  listar(filtros: FiltrosOrden = {}) {
    let params = new HttpParams();
    for (const [clave, valor] of Object.entries(filtros)) if (valor) params = params.set(clave, valor);
    return this.http.get<Orden[]>(this.url, { params });
  }
  buscar(id: number) { return this.http.get<Orden>(this.url + '/' + id); }
  registrar(r: OrdenRequest) { return this.http.post<Orden>(this.url, r); }
  anular(id: number, motivo: string) { return this.http.patch<Orden>(this.url + '/' + id + '/anular', { motivo }); }
}
