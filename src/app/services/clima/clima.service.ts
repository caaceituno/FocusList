import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClimaService {
  private apiUrl = 'http://api.weatherapi.com/v1/current.json'; // Endpoint de clima actual
  private apiKey = '144320d5e11b4000926144428252410'; // Reemplázalo con tu clave

  constructor(private http: HttpClient) {}

  getWeather(city: string): Observable<any> {
    const url = `${this.apiUrl}?key=${this.apiKey}&q=${city}`;
    return this.http.get(url);
  }
}
