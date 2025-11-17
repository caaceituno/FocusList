import { Component, OnInit, OnDestroy } from '@angular/core';
import { ClimaService } from '../../services/clima/clima.service';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
  standalone: false
})
export class TestPage implements OnInit, OnDestroy {

  weatherData: any;
  private watchId: string | null = null;
  
  constructor(private ClimaService: ClimaService) { }

  async ngOnInit(): Promise<void> {
    const perm: any = await Geolocation.requestPermissions();
    // en algunas versiones perm puede venir como { location: 'granted' } o similar
    const granted = perm?.location === 'granted' || perm === 'granted';
    if (!granted) {
      console.error('Permiso de ubicación denegado', perm);
      return;
    }

    try {
      // obtener posición inicial (para evitar pantalla de carga indefinida)
      const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
      this.fetchWeather(pos.coords.latitude, pos.coords.longitude);
    } catch (e) {
      console.error('Error al obtener posición inicial', e);
    }

    // luego iniciar watch para actualizaciones
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
    this.ClimaService.getWeatherByCoords(lat, lon)
      .subscribe({
        next: (data: any) => {
          this.weatherData = data;
          console.log('weather', this.weatherData);
        },
        error: (error) => {
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
