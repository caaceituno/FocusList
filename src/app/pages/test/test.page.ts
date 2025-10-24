import { Component, OnInit } from '@angular/core';
import { ClimaService } from '../../services/clima/clima.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
  standalone: false
})
export class TestPage implements OnInit {

  weatherData: any;

  constructor(private ClimaService: ClimaService) { }

  ngOnInit(): void {
    this.ClimaService.getWeather('Santiago')  // Cambia 'Santiago' por cualquier ciudad
      .subscribe((data: any) => {
        this.weatherData = data;  // Guardamos los datos obtenidos
        console.log(this.weatherData);  // Verifica los datos en la consola
      });
  }

}
