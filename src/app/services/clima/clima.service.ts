import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Geolocation } from '@capacitor/geolocation';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClimaService {

  private apiUrl = 'https://api.weatherapi.com/v1/current.json';
  private climaApiKey = environment.climaApiKey;

  // CACHE
  private cachedWeather: any = null;
  private cachedCoords: { lat: number; lon: number } | null = null;
  private hasLoaded = false;

  constructor(private http: HttpClient) {}

  /** Carga clima UNA sola vez (GPS solo una vez también) */
  async loadWeatherOnce(): Promise<any> {

    // Si ya cargamos clima antes → devolver inmediatamente
    if (this.hasLoaded && this.cachedWeather) {
      return this.cachedWeather;
    }

    // 1) Obtener ubicación (una sola vez)
    if (!this.cachedCoords) {
      const pos = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true
      });

      this.cachedCoords = {
        lat: pos.coords.latitude,
        lon: pos.coords.longitude
      };
    }

    // 2) Llamada API solo una vez
    const url = `${this.apiUrl}?key=${this.climaApiKey}&q=${this.cachedCoords.lat},${this.cachedCoords.lon}&lang=es`;

    const data = await this.http.get(url).toPromise();

    this.cachedWeather = data;
    this.hasLoaded = true;

    return data;
  }

  /** Permite obtener clima ya cargado sin pedir nada */
  getCachedWeather() {
    return this.cachedWeather;
  }
}
