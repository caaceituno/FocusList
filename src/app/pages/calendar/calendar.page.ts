import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, CalendarApi } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { FeriadosService } from '../../services/feriado/feriado.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
  standalone: false,
})
export class CalendarPage implements OnInit {
  @ViewChild('fullCalendar') fullCalendar!: FullCalendarComponent;
  calendarOptions!: CalendarOptions;
  loading = true;
  allFeriados: any[] = [];
  eventosMes: any[] = [];
  tituloMes = '';
  diaActual = this.formatFecha(new Date());
  annio: number = new Date().getFullYear();

  constructor(private feriadosService: FeriadosService) {}

  touchStartX = 0;
  touchEndX = 0;

  ngOnInit() {
    this.feriadosService.obtenerFeriados(this.annio).subscribe({
      next: (data) => {

        console.log('🔍 RAW DATA FERIADOS:', data);
        const rawData = Array.isArray(data)
          ? data
          : data?.data
          ? data.data
          : data[this.annio] || [];

        this.allFeriados = rawData.map((feriado: any) => ({
          title: feriado.title || feriado.name || 'Feriado',
          start: feriado.date,
          allDay: true,
          color: '#ff5c5c',
        }));

        this.calendarOptions = {
          initialView: 'dayGridMonth',
          plugins: [dayGridPlugin, interactionPlugin],
          locale: 'es',
          height: 'auto',
          headerToolbar: false,
          events: this.allFeriados,
          dateClick: this.handleDateClick.bind(this),
          datesSet: this.handleMonthChange.bind(this),
        };

        this.updateEventosMes(new Date());
      },
      error: (error) => {
        console.error('Error cargando feriados:', error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  handleDateClick(arg: any) {
    alert(`Día seleccionado: ${arg.dateStr}`);
  }

  handleMonthChange(arg: any) {
    const mitadRango = new Date((arg.start.getTime() + arg.end.getTime()) / 2);
    this.annio = mitadRango.getFullYear();
    console.log('Año actual del calendario:', this.annio);
    
    //cargar feriados del año si cambiamos de año
    this.feriadosService.obtenerFeriados(this.annio).subscribe({
      next: (data) => {
        const rawData = Array.isArray(data)
          ? data
          : data?.data
          ? data.data
          : data[this.annio] || [];

        this.allFeriados = rawData.map((feriado: any) => ({
          title: feriado.title || feriado.name || 'Feriado',
          start: feriado.date,
          allDay: true,
          color: '#ff5c5c',
        }));
        const calendarApi = this.fullCalendar.getApi();
        calendarApi.removeAllEvents();
        calendarApi.addEventSource(this.allFeriados);
        this.updateEventosMes(mitadRango);
      },
      error: (error) => console.error('Error cargando feriados:', error)
    });
    
    this.updateTituloMes(mitadRango);
  }

  updateEventosMes(fecha: Date) {
    const mes = fecha.getMonth();
    const anio = fecha.getFullYear();
    this.eventosMes = this.allFeriados.filter((e) => {
      const d = new Date(e.start);
      return d.getMonth() === mes && d.getFullYear() === anio;
    });
  }

  updateTituloMes(fecha: Date) {
    const opciones: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
    let texto = fecha.toLocaleDateString('es-ES', opciones);
    texto = texto.replace(' de ', ' ');
    this.tituloMes = texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  //detectar swipe manualmente
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  onTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
  }

  handleSwipe() {
    const calendarApi: CalendarApi | undefined = this.fullCalendar?.getApi?.();
    if (!calendarApi) return;

    const diff = this.touchEndX - this.touchStartX;
    if (Math.abs(diff) < 60) return;

    if (diff > 0) {
      calendarApi.prev();
    } else {
      calendarApi.next();
    }

    const fechaActual = calendarApi.getDate();
    this.updateEventosMes(fechaActual);
    this.updateTituloMes(fechaActual);
  }

  formatFecha(fecha: string | Date): string {
    const date = new Date(fecha);
    const opciones: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    let texto = date.toLocaleDateString('es-ES', opciones);
    texto = texto.replace(',', '');

    texto = texto
      .split(' ')
      .map(word => word === 'de' ? word : word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return texto;
  }
}
