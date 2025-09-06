import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  usuario: any = {
    email: '',
    contrasena: '',
  };

  constructor(
    private router: Router,
    private toastController: ToastController
  ) { }


  ngOnInit(): void {
  }

  async iniciarSesion() {
    const { value } = await Preferences.get({ key: 'last_user' });

    if (!value) {
      this.presentToast('No hay usuarios registrados');
      return;
    }

    const registrado = JSON.parse(value);

    if (
      this.usuario.email === registrado.email &&
      this.usuario.contrasena === registrado.contrasena
    ) {
      this.presentToast('Inicio de sesión exitoso');
      this.router.navigate(['/home'], { state: { usuario: registrado } });
    } else {
      this.presentToast('Credenciales inválidas');
    }
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'top',
    });
    await toast.present();
  }
}