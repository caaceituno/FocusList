import { Component, OnInit } from '@angular/core';
import { RecoverService } from 'src/app/services/recover/recover.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-recover',
  templateUrl: './recover.page.html',
  styleUrls: ['./recover.page.scss'],
  standalone: false,
})
export class RecoverPage implements OnInit {

  email = '';

  constructor(
    private recoverService: RecoverService,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  async ngOnInit() {
    // Si ya hay un flujo activo → saltar directo a /token
    const state = await Preferences.get({ key: 'recoverInProgress' });

    if (state.value === 'true') {
      this.router.navigate(['/token']);
    }
  }

  async enviarCorreo() {
    const result = await this.recoverService.recoverPassword(this.email);

    this.mostrarToast(result.msg);

    if (result.ok) {

      // Guardar email para continuar flujo aunque la app se reinicie
      await Preferences.set({
        key: 'recoverEmail',
        value: this.email
      });

      // Guardar estado de que existe un flujo activo
      await Preferences.set({
        key: 'recoverInProgress',
        value: 'true'
      });

      // Redirigir a pantalla donde el usuario ingresa el token
      setTimeout(() => {
        this.router.navigate(['/token']);
      }, 1500);
    }
  }

  async mostrarToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      color: 'warning',
      duration: 2500
    });
    toast.present();
  }
}
