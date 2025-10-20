import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root'})
export class FeriadosService {
  private apiUrl = 'https://api.boostr.cl/holidays';

  constructor(private http: HttpClient) {}

  obtenerFeriados(annio?: number): Observable<any> {
    const url = annio ? `${this.apiUrl}/${annio}` : this.apiUrl;
    console.log('🌐 URL solicitada a la API:', url);
    return this.http.get(url);
  }
}