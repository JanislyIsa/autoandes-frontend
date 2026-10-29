import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Vehiculo, VehiculoRequest } from '../models/api.models';
@Injectable({ providedIn: 'root' })
export class VehiculoService {
  private readonly http = inject(HttpClient);
  private readonly url = environment.apiUrl + '/vehiculos';
  listar(clienteId?: number) {
    const params = clienteId ? new HttpParams().set('clienteId', clienteId) : new HttpParams();
    return this.http.get<Vehiculo[]>(this.url, { params });
  }
  buscar(id: number) { return this.http.get<Vehiculo>(this.url + '/' + id); }
  crear(r: VehiculoRequest) { return this.http.post<Vehiculo>(this.url, r); }
  actualizar(id: number, r: VehiculoRequest) { return this.http.put<Vehiculo>(this.url + '/' + id, r); }
  eliminar(id: number) { return this.http.delete<void>(this.url + '/' + id); }
}
