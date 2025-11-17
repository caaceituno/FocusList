import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClimaService {
  private apiUrl = 'https://api.weatherapi.com/v1/current.json'; // HTTPS y endpoint correcto
  private apiKey = '144320d5e11b4000926144428252410';

  constructor(private http: HttpClient) {}

  getWeatherByCoords(lat: number, lon: number): Observable<any> {
    // weatherapi.com espera key y q=lat,lon
    const url = `${this.apiUrl}?key=${this.apiKey}&q=${lat},${lon}&lang=es`;
    return this.http.get(url);
  }
}
