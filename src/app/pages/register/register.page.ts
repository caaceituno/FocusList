import { Component, input, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Users } from '../../interfaces/users';
import { Usuario } from 'src/app/clases/usuario';
import { UsuarioService } from '../../services/registro/usuario.service';
import { Dbservice } from 'src/app/services/SQLite/dbservice';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})


export class RegisterPage implements OnInit {


  usuario: Users = {
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


      //para guardar en local
      await this.usuarioService.guardarUsuario(this.usuario);
      //guardado en sqlite
      await this.dbService.addUsuario(this.usuario.nombre,this.usuario.apellido,this.usuario.email,this.usuario.contrasena)


      //verificacion en consola
      console.log('Usuarios guardados:', await this.usuarioService.mostrarUsuarios());


      console.log('usuarios guardado en sqlite', await this.dbService.cargarUsuarios());


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
