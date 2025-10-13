import { Component, OnInit } from '@angular/core';
import { CalendarOptions, DatesSetArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
  standalone: false,
})
export class CalendarPage implements OnInit {
  calendarOptions!: CalendarOptions;
  loading = true;
  allFeriados: any[] = [];
  eventosMes: any[] = [];

  async ngOnInit() {
    try {
      const response = await fetch('https://api.boostr.cl/holidays');
      const data = await response.json();

      // Normalizamos los feriados
      this.allFeriados = (data.data || []).map((feriado: any) => ({
        title: feriado.title || feriado.name || 'Feriado',
        start: feriado.date,
        allDay: true,
        color: '#ff5c5c',
      }));

      // Configuración de FullCalendar
      this.calendarOptions = {
        initialView: 'dayGridMonth',
        plugins: [dayGridPlugin, interactionPlugin],
        locale: 'es',
        height: 'auto',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: '',
        },
        events: this.allFeriados,
        dateClick: this.handleDateClick.bind(this),
        datesSet: this.handleMonthChange.bind(this),
      };

      // Mostrar el mes actual al iniciar
      this.updateEventosMes(new Date());
    } catch (error) {
      console.error('Error cargando feriados:', error);
    } finally {
      this.loading = false;
    }
  }

  /** 🔹 Filtra los feriados del mes visible en el calendario */
  handleMonthChange(arg: any) {
    // En vez de usar arg.start (que es antes del mes visible)
    // usamos la mitad del rango visible
    const mitadRango = new Date((arg.start.getTime() + arg.end.getTime()) / 2);
    this.updateEventosMes(mitadRango);
  }

  updateEventosMes(fecha: Date) {
    // ⚙️ Tomamos el mes central (no el inicio del rango)
    const ahora = new Date(fecha);
    const mesActual = ahora.getMonth();
    const añoActual = ahora.getFullYear();

    this.eventosMes = this.allFeriados.filter((e) => {
      const d = new Date(e.start);
      return d.getMonth() === mesActual && d.getFullYear() === añoActual;
    });
  }

  handleDateClick(arg: any) {
    alert(`📅 Día seleccionado: ${arg.dateStr}`);
  }
}
