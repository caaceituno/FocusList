import { Component, OnInit, OnDestroy } from '@angular/core';
import { ClimaService } from '../../services/clima/clima.service'; // <-- ruta corregida
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-clima',
  templateUrl: './clima.component.html',
  styleUrls: ['./clima.component.scss'],
  standalone: false
})
export class ClimaComponent implements OnInit, OnDestroy {

  weatherData: any;
  private watchId: any = null;
  
  constructor(private climaService: ClimaService) { } // nombre en camelCase

  async ngOnInit(): Promise<void> {
    const perm: any = await Geolocation.requestPermissions();
    const granted = perm?.location === 'granted' || perm === 'granted';
    if (!granted) {
      console.error('Permiso de ubicación denegado', perm);
      return;
    }

    try {
      const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
      this.fetchWeather(pos.coords.latitude, pos.coords.longitude);
    } catch (e) {
      console.error('Error al obtener posición inicial', e);
    }

    this.watchId = await Geolocation.watchPosition(
      { enableHighAccuracy: true, maximumAge: 1000 },
      (position, err) => {
        if (err) {
          console.error('Geolocation error', err);
          return;
        }
        if (!position) return;
        this.fetchWeather(position.coords.latitude, position.coords.longitude);
      }
    );
  }

  private fetchWeather(lat: number, lon: number) {
    this.climaService.getWeatherByCoords(lat, lon)
      .subscribe({
        next: (data: any) => {
          this.weatherData = data;
          console.log('weather', this.weatherData);
        },
        error: (error: any) => {
          console.error('Error al obtener clima', error);
        }
      });
  }

  ngOnDestroy(): void {
    if (this.watchId != null) {
      Geolocation.clearWatch({ id: this.watchId });
      this.watchId = null;
    }
  }

}
