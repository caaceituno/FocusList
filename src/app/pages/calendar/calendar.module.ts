import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CalendarPageRoutingModule } from './calendar-routing.module';
import { CalendarPage } from './calendar.page';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ClimaComponent } from '../../components/clima/clima.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalendarPageRoutingModule,
    FullCalendarModule,
  ],
  declarations: [
    CalendarPage,
    ClimaComponent,
  ],
})
export class CalendarPageModule {}
