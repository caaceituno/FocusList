import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FeriadosService {
  private apiUrl = 'https://api.boostr.cl/holidays';

  constructor(private http: HttpClient) {}

  obtenerFeriados(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
