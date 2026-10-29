import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Cliente } from '../models/api.models';
@Injectable({ providedIn: 'root' })
export class ClienteService {
  private readonly http = inject(HttpClient);
  listar() { return this.http.get<Cliente[]>(environment.apiUrl + '/clientes'); }
}
