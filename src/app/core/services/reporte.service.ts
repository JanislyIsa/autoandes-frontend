import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { IngresoServicio } from '../models/api.models';
@Injectable({ providedIn: 'root' })
export class ReporteService {
  private readonly http = inject(HttpClient);
  ingresos(desde: string, hasta: string) {
    let params = new HttpParams();
    if (desde) params = params.set('desde', desde);
    if (hasta) params = params.set('hasta', hasta);
    return this.http.get<IngresoServicio[]>(environment.apiUrl + '/reportes/ingresos-por-servicio', { params });
  }
}
