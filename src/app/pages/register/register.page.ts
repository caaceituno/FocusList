import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { User } from '../../interfaces/users';
import { UsuarioService } from '../../services/registro/usuario.service';
import { Dbservice } from 'src/app/services/SQLite/dbservice';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})


export class RegisterPage implements OnInit {


  usuario: User = {
  id: 0,
  nombre: '',
  apellido: '',
  email: '',
  contrasena: '',
  };

  field: string="";

  errorMessage: String = ''

  constructor(
    public toastController: ToastController,
    private router: Router,
    private usuarioService: UsuarioService,
    private dbService: Dbservice
  ) {}


  ngOnInit(): void {
  }


  //Método registrar
  async registro() {
    if (this.validacionModelo(this.usuario)) {

      // Guardado en SQLite a través del servicio 
      const ok = await this.usuarioService.guardarUsuario(this.usuario);

      if (!ok) {
        this.presentToast('top', 'Error al registrar el usuario', 5000);
        return;
      }

      console.log('Usuarios guardados:', await this.usuarioService.mostrarUsuarios());
      console.log('Usuarios en SQLite:', await this.dbService.cargarUsuarios());

      let navigationExtras: NavigationExtras = {
        state: { usuario: this.usuario }
      };

      this.router.navigate(['/login'], navigationExtras);

    } else {
      this.presentToast('top', 'Error: Falta ' + this.field, 5000);
    }
  }

  validacionModelo(model: any) {
    for (const [key, value] of Object.entries(model)) {
      // Omitir validación del id (se asigna en la BD)
      if (key === 'id') continue;

      if (value === null || value === undefined) {
        this.field = key;
        return false;
      }

      if (typeof value === 'string' && value.trim() === '') {
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
