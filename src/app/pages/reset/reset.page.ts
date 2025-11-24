import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/registro/usuario.service';
import { ToastController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.page.html',
  styleUrls: ['./reset.page.scss'],
  standalone: false,
})
export class ResetPage implements OnInit {

  email = '';
  password = '';

  constructor(
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
    });
  }

  async resetPassword() {
    if (!this.password || this.password.length < 4) {
      this.toast('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    // Actualizar contraseña
    await this.usuarioService.actualizarContrasena(this.email, this.password);

    // limpiar estado de recuperación
    await Preferences.remove({ key: 'recoverInProgress' });
    await Preferences.remove({ key: 'recoverEmail' });

    this.toast('Tu contraseña fue actualizada.');

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1500);
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
