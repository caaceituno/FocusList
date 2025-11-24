import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/registro/usuario.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-token',
  templateUrl: './token.page.html',
  styleUrls: ['./token.page.scss'],
  standalone: false,
})
export class TokenPage implements OnInit {

  token = '';
  email = '';

  constructor(
    private usuarioService: UsuarioService,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  async ngOnInit() {
    // cargar email guardado
    const saved = await Preferences.get({ key: 'recoverEmail' });
    this.email = saved.value ?? '';

    if (!this.email) {
      // si por algún motivo no hay email → volver al recover
      this.router.navigate(['/recover']);
    }
  }

  async validarToken() {
    if (!this.token.trim()) {
      this.toast('Debes ingresar un código.');
      return;
    }

    const usuario = await this.usuarioService.buscarPorToken(this.token);

    if (!usuario) {
      this.toast('Código inválido o expirado.');
      return;
    }

    // Marcar que estamos por resetear contraseña
    await Preferences.set({
      key: 'recoverInProgress',
      value: 'resetting'
    });

    // Navegar al reset con el email
    this.router.navigate(['/reset'], {
      queryParams: { email: usuario.email }
    });
  }

  async toast(msg: string) {
    const t = await this.toastCtrl.create({
      message: msg,
      duration: 2500,
      color: 'warning'
    });
    t.present();
  }
}
