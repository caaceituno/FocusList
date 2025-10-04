import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { UsuarioService } from '../../services/registro/usuario.service';
import { Login } from '../../interfaces/login';

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
    private usuarioService: UsuarioService
  ) { }


  ngOnInit(): void {
  }

  async iniciarSesion() {
    const usuarios = await this.usuarioService.mostrarUsuarios();

    if (!usuarios || usuarios.length === 0) {
      this.presentToast('No hay usuarios registrados');
      return;
    }

    //buscar si el email y contraseña coinciden
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
  }
    

  private async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'top',
    });
    await toast.present();
  }
}