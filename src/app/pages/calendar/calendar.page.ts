import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { FeriadosService } from '../../services/feriado/feriado.service';
import { ClimaService } from '../../services/clima/clima.service';
import { TareasService } from 'src/app/services/tareas/tareas.service';
import { UsuarioService } from 'src/app/services/registro/usuario.service';
import { Tarea } from 'src/app/interfaces/tarea';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
  standalone: false,
})
export class CalendarPage implements OnInit, OnDestroy {

  @ViewChild('fullCalendar') fullCalendar!: FullCalendarComponent;

  /* ================================
     ESTADO PRINCIPAL
  ================================== */
  calendarOptions!: CalendarOptions;
  loading = true;

  allFeriados: any[] = [];
  tareasEventos: any[] = [];
  combinedEvents: any[] = [];

  eventosMes: any[] = [];
  eventosFeriadosMes: any[] = [];
  tareasMes: any[] = [];

  tituloMes = '';
  diaActual = this.formatFecha(new Date());
  annio: number = new Date().getFullYear();

  calendarReady = false;

  /* Header animado */
  headerReady = true;
  headerAnimate = false;

  /* Clima */
  weatherData: any = null;

  /* Usuario y tareas */
  private tareasSub: any;
  usuarioId: number | null = null;

  /* Modal */
  mostrarModal = false;
  eventosDelDia: any[] = [];
  fechaSeleccionada = '';

  touchStartX = 0;
  touchEndX = 0;

  constructor(
    private feriadosService: FeriadosService,
    private climaService: ClimaService,
    private tareasService: TareasService,
    private usuarioService: UsuarioService
  ) {}

  /* ================================
     ANIMACIÓN DEL HEADER AL ENTRAR
  ================================= */
  ionViewDidEnter() {
    this.headerAnimate = false;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.headerAnimate = true;
      });
    });
  }

  /* ================================
     INICIALIZACIÓN
  ================================= */
  async ngOnInit() {

    setTimeout(() => {
      this.headerReady = true;
    }, 30);

    this.weatherData = this.climaService.getCachedWeather();
    if (!this.weatherData) {
      this.climaService.loadWeatherOnce().then(data => {
        this.weatherData = data;
      });
    }

    this.feriadosService.obtenerFeriados(this.annio).subscribe({
      next: (data) => {
        const raw = Array.isArray(data)
          ? data
          : data?.data
          ? data.data
          : data[this.annio] || [];

        this.allFeriados = raw.map((f: any) => ({
          title: f.title || f.name || 'Feriado',
          // Normalize to local Date to avoid timezone shifts when parsing 'YYYY-MM-DD'
          start: this.parseDateToLocal(f.date),
          allDay: true,
          color: '#a9a9a9',
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

        this.initTareasForUser();
        this.updateEventosMes(new Date());
      },
      complete: () => {
        this.loading = false;
        this.calendarReady = true;
      }
    });
  }

  /* ================================
     TAREAS DEL USUARIO
  ================================= */
  private async initTareasForUser() {
    const usuario = await this.usuarioService.getUsuarioActivo();
    if (!usuario?.id) return;

    this.usuarioId = usuario.id;

    await this.tareasService.obtenerTareas(this.usuarioId).catch(() => {});    

    this.tareasSub = this.tareasService.getTareasObservable().subscribe((tareas: Tarea[]) => {

      this.tareasEventos = (tareas || []).map(t => ({
        title: t.titulo || 'Tarea',
        // Stored in DB as 'YYYY-MM-DD' — convert to local Date object
        start: this.parseDateToLocal(t.fecha),
        allDay: true,
        extendedProps: { tarea: t },
        color:
          t.importancia === 'alta' ? '#ff5c5c' :
          t.importancia === 'media' ? '#ffb86b' :
          '#8be08b'
      }));

      this.combinedEvents = [...this.allFeriados, ...this.tareasEventos];

      const api = this.fullCalendar?.getApi?.();
      if (api) {
        api.removeAllEvents();
        api.addEventSource(this.combinedEvents);
        this.updateEventosMes(api.getDate());
      }

      this.calendarReady = true;
    });
  }

  /* ================================
     CLICK EN UN DÍA
  ================================= */
  handleDateClick(arg: any) {
    const fecha = arg.dateStr;
    const d = this.parseDateToLocal(fecha);

    const feriados = this.allFeriados.filter(f => {
      const fd = this.parseDateToLocal(f.start);
      return fd.toDateString() === d.toDateString();
    });

    const tareas = this.tareasEventos.filter(t => {
      const td = this.parseDateToLocal(t.start);
      return td.toDateString() === d.toDateString();
    });

    this.eventosDelDia = [...feriados, ...tareas];
    this.fechaSeleccionada = fecha;
    this.mostrarModal = true;
  }

  /* ================================
     CAMBIO DE MES
  ================================= */
  handleMonthChange(arg: any) {
    const mitad = new Date((arg.start.getTime() + arg.end.getTime()) / 2);
    this.annio = mitad.getFullYear();

    this.updateTituloMes(mitad);
    this.updateEventosMes(mitad);
  }

  updateEventosMes(fecha: Date) {
    const mes = fecha.getMonth();
    const anio = fecha.getFullYear();

    this.eventosFeriadosMes = this.allFeriados.filter(ev => {
      const d = this.parseDateToLocal(ev.start);
      return d.getMonth() === mes && d.getFullYear() === anio;
    });

    this.tareasMes = this.tareasEventos.filter(ev => {
      const d = this.parseDateToLocal(ev.start);
      return d.getMonth() === mes && d.getFullYear() === anio;
    });

    this.eventosMes = [...this.eventosFeriadosMes, ...this.tareasMes];
  }

  updateTituloMes(fecha: Date) {
    const opciones = { month: 'long', year: 'numeric' } as const;
    let texto = fecha.toLocaleDateString('es-ES', opciones);
    texto = texto.replace(' de ', ' ');
    this.tituloMes = texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  /* ================================
     SWIPE PARA CAMBIAR MES
  ================================= */
  onTouchStart(e: TouchEvent) {
    this.touchStartX = e.changedTouches[0].screenX;
  }

  onTouchEnd(e: TouchEvent) {
    this.touchEndX = e.changedTouches[0].screenX;
    this.handleSwipe();
  }

  handleSwipe() {
    const api = this.fullCalendar?.getApi?.();
    if (!api) return;

    const diff = this.touchEndX - this.touchStartX;
    if (Math.abs(diff) < 60) return;

    if (diff > 0) api.prev();
    else api.next();

    const fecha = api.getDate();
    this.updateEventosMes(fecha);
    this.updateTituloMes(fecha);
  }

  /* ================================
     UTILIDADES
  ================================= */
  private parseDateToLocal(fecha: any): Date {
    if (!fecha) return new Date();

    // If already a Date
    if (fecha instanceof Date) {
      return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
    }

    const s = String(fecha);

    // ISO with time (e.g. 2025-11-25T00:00:00)
    if (s.includes('T')) {
      const d = new Date(s);
      return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }

    // SQLite format YYYY-MM-DD
    if (s.includes('-')) {
      const partes = s.split('-');
      const y = Number(partes[0]);
      const m = Number(partes[1]) - 1;
      const day = Number(partes[2]);
      return new Date(y, m, day);
    }

    // Fallback
    const d = new Date(s);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  formatFecha(fecha: string | Date): string {
    const date = new Date(fecha);
    const opciones = { weekday: 'long', day: 'numeric', month: 'long' } as const;

    let texto = date.toLocaleDateString('es-ES', opciones).replace(',', '');
    return texto
      .split(' ')
      .map(w => (w === 'de' ? w : w.charAt(0).toUpperCase() + w.slice(1)))
      .join(' ');
  }

  /* ================================
     LIMPIEZA DE SUBSCRIPCIONES
  ================================= */
  ngOnDestroy() {
    if (this.tareasSub) {
      try { this.tareasSub.unsubscribe(); } catch {}
    }
  }
}
