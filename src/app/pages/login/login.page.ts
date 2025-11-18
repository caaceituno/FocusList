import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, Platform } from '@ionic/angular';
import { UsuarioService } from '../../services/registro/usuario.service';
import { Login } from '../../interfaces/login';
import { Dbservice } from 'src/app/services/SQLite/dbservice';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {

  usuario: Login = {
    email: '',
    contrasena: ''
  };

  constructor(
    private router: Router,
    private toastController: ToastController,
    private usuarioService: UsuarioService,
    private platform: Platform
  ) { }

  async ngOnInit() {
    if (!this.platform.is('cordova')) {
      // Estamos en PC → Saltar login
      await this.usuarioService.setUsuarioActivo({
        id: 1,
        nombre: 'DevUser',
        apellido: 'Local',
        email: 'dev@local',
        contrasena: '1234'
      });

      this.router.navigate(['/home']);
    }
  }

  async iniciarSesion() {
    const usuarios = await this.usuarioService.mostrarUsuarios();
    //const usuariosSql = await this.dbService.cargarUsuarios();

    if (!usuarios || usuarios.length === 0) {
      this.presentToast('No hay usuarios registrados en localstorage');
      return;
    }

    //buscar si el email y contrasena coinciden
    const registrado = usuarios.find(
      u => u.email === this.usuario.email && u.contrasena === this.usuario.contrasena
    );


    if (registrado) {
      this.presentToast('Inicio de sesión exitoso');
      await this.usuarioService.setUsuarioActivo(registrado);
      this.router.navigate(['/home']);
    } else {
      this.presentToast('Credenciales inválidas');
    }
  };


  private async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'top',
    });
    await toast.present();
  }
}
