import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CalendarOptions, CalendarApi } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { FeriadosService } from '../../services/feriado/feriado.service';
import { ClimaService } from '../../services/clima/clima.service';
import { TareasService } from 'src/app/services/tareas/tareas.service';
import { UsuarioService } from 'src/app/services/registro/usuario.service';
import { Tarea } from 'src/app/interfaces/tarea';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
  standalone: false,
})
export class CalendarPage implements OnInit, OnDestroy {
  @ViewChild('fullCalendar') fullCalendar!: FullCalendarComponent;
  calendarOptions!: CalendarOptions;
  loading = true;
  allFeriados: any[] = [];
  tareasEventos: any[] = [];
  eventosMes: any[] = [];
  combinedEvents: any[] = [];
  tituloMes = '';
  diaActual = this.formatFecha(new Date());
  annio: number = new Date().getFullYear();

  // ADDED: clima state
  weatherData: any = null;
  private watchId: any = null;

  // MODIFY constructor: inyectar ClimaService además de FeriadosService
  private tareasSub: any;
  usuarioId: number | null = null;

  constructor(
    private feriadosService: FeriadosService,
    private climaService: ClimaService, // <-- agregado
    private tareasService: TareasService,
    private usuarioService: UsuarioService
  ) {}

  touchStartX = 0;
  touchEndX = 0;

  async ngOnInit() {
    // INICIALIZA clima (no bloqueante)
    this.initClima().catch(err => console.warn('initClima error', err));

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
        // Cargar usuario y tareas del usuario
        this.initTareasForUser().catch(err => console.warn('initTareasForUser error', err));

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

  // Inicializa tareas del usuario y suscripción al observable
  private async initTareasForUser() {
    const usuario = await this.usuarioService.getUsuarioActivo();
    if (!usuario?.id) return;
    this.usuarioId = usuario.id;

    // Obtener tareas iniciales (asegura que el servicio cargue de DB)
    try {
      await this.tareasService.obtenerTareas(this.usuarioId);
    } catch (e) {
      console.warn('Error obteniendo tareas iniciales', e);
    }

    // Suscribirse a cambios en tareas
    this.tareasSub = this.tareasService.getTareasObservable().subscribe((tareas: Tarea[]) => {
      this.tareasEventos = (tareas || []).map(t => ({
        title: t.titulo || 'Tarea',
        start: t.fecha,
        allDay: true,
        extendedProps: { tarea: t },
        color: t.importancia === 'alta' ? '#ff5c5c' : (t.importancia === 'media' ? '#ffb86b' : '#8be08b')
      }));

      // Combinar feriados + tareas y actualizar calendario
      this.combinedEvents = [...this.allFeriados, ...this.tareasEventos];
      const calendarApi = this.fullCalendar?.getApi?.();
      if (calendarApi) {
        calendarApi.removeAllEvents();
        calendarApi.addEventSource(this.combinedEvents);
        this.updateEventosMes(calendarApi.getDate());
      }
    });
  }

  // NEW: inicializar geolocalización y watch
  private async initClima() {
    console.log('[CalendarPage] initClima');
    try {
      const perm: any = await Geolocation.requestPermissions();
      const granted = perm?.location === 'granted' || perm === 'granted';
      console.log('[CalendarPage] permiso ubicación:', perm);
      if (!granted) {
        console.warn('Permiso de ubicación denegado', perm);
        return;
      }
    } catch (e) {
      console.warn('requestPermissions error', e);
    }

    try {
      const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true }).catch(() => null);
      if (pos?.coords) {
        this.fetchWeather(pos.coords.latitude, pos.coords.longitude);
      } else {
        console.log('[CalendarPage] getCurrentPosition no disponible (web/emulador)');
      }
    } catch (e) {
      console.error('Error al obtener posición inicial', e);
    }

    // iniciar watch (safe)
    try {
      this.watchId = await Geolocation.watchPosition(
        { enableHighAccuracy: true, maximumAge: 1000 },
        (position, err) => {
          if (err) {
            console.error('Geolocation watch error', err);
            return;
          }
          if (!position) return;
          this.fetchWeather(position.coords.latitude, position.coords.longitude);
        }
      );
    } catch (e) {
      console.warn('watchPosition failed', e);
    }
  }

  // NEW: obtener clima usando el servicio existente
  private fetchWeather(lat: number, lon: number) {
    console.log('[CalendarPage] fetchWeather', lat, lon);
    this.climaService.getWeatherByCoords(lat, lon).subscribe({
      next: (data: any) => {
        console.log('[CalendarPage] weather data', data);
        this.weatherData = data;
      },
      error: (error: any) => {
        console.error('Error al obtener clima', error);
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
        this.combinedEvents = [...this.allFeriados, ...this.tareasEventos];
        calendarApi.removeAllEvents();
        calendarApi.addEventSource(this.combinedEvents);
        this.updateEventosMes(mitadRango);
      },
      error: (error) => console.error('Error cargando feriados:', error)
    });
    
    this.updateTituloMes(mitadRango);
  }

  updateEventosMes(fecha: Date) {
    const mes = fecha.getMonth();
    const anio = fecha.getFullYear();
    this.eventosMes = (this.combinedEvents || []).filter((e) => {
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

  ngOnDestroy(): void {
    // limpiar watch de geolocalización si existe
    if (this.watchId != null) {
      try {
        Geolocation.clearWatch({ id: this.watchId });
      } catch {}
      this.watchId = null;
    }
    if (this.tareasSub) {
      try { this.tareasSub.unsubscribe(); } catch {}
      this.tareasSub = null;
    }
  }
}
