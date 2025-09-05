import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WelcomePageRoutingModule } from './welcome-routing.module';

import { WelcomePage } from './welcome.page';

// Si necesitas agregar módulos adicionales, como Material Design, los importas aquí
// Ejemplo: import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WelcomePageRoutingModule,
    // Agrega aquí cualquier módulo adicional que necesites
    // Ejemplo: MatProgressSpinnerModule,
  ],
  declarations: [WelcomePage],
})
export class WelcomePageModule {}
