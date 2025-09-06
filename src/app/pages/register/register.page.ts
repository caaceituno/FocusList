import { Component, input, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})


export class RegisterPage implements OnInit {

  usuario: any = {
    nombre:  '',
    apellido: '',
    email: '',
    contrasena: '',
  }

  field: string="";

  errorMessage: String = ''

  constructor(public toastController: ToastController, private router: Router) {}
  ngOnInit(): void {}

  // Método registrar
    async registro() {
    if (this.validacionModelo(this.usuario)) {

      //para guardar en local
      await Preferences.set({
        key: 'last_user',
        value: JSON.stringify(this.usuario)
      });

      //verificacion en consola
      const { value } = await Preferences.get({ key: 'last_user' });
      console.log('Usuario guardado en local:', value);

      let navigationExtras: NavigationExtras = {
        state: { usuario: this.usuario }
      };
      this.router.navigate(['/login'], navigationExtras);
    } else {
      this.presentToast('top', 'Error: Falta ' + this.field, 5000);
    }
  }

  validacionModelo(model: any) {
    for (var [key, value] of Object.entries(model)) {
      if (value == '') {
        this.field = key;
        return false;
      }
    }
    return true;
  }

  async presentToast(position: 'top' | 'middle' | 'bottom', msg: string, duration?: number) {
    const toast = await this.toastController.create({
      message: msg,
      duration: duration ? duration : 2500,
      position: position,
    });

    await toast.present();
  }
}
