import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Servicio, ServicioRequest } from '../models/api.models';
@Injectable({ providedIn: 'root' })
export class ServicioService {
  private readonly http = inject(HttpClient);
  private readonly url = environment.apiUrl + '/servicios';
  listar() { return this.http.get<Servicio[]>(this.url); }
  buscar(id: number) { return this.http.get<Servicio>(this.url + '/' + id); }
  crear(r: ServicioRequest) { return this.http.post<Servicio>(this.url, r); }
  actualizar(id: number, r: ServicioRequest) { return this.http.put<Servicio>(this.url + '/' + id, r); }
  eliminar(id: number) { return this.http.delete<void>(this.url + '/' + id); }
  estado(id: number, activo: boolean) { return this.http.patch<Servicio>(this.url + '/' + id + '/estado', { activo }); }
}
