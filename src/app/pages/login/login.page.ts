import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
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
    private dbService: Dbservice
  ) { }




  ngOnInit(): void {
  }


  async iniciarSesion() {
    const usuarios = await this.usuarioService.mostrarUsuarios();
    //const usuariosSql = await this.dbService.cargarUsuarios();


    if (!usuarios || usuarios.length === 0) {
      this.presentToast('No hay usuarios registrados en localstorage');
      return;
    }


    //if (!usuariosSql || usuariosSql.length===0){
    //  this.presentToast('no hay usuarios guardados en la base de datos');
    //  return;
    //}


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


    //const registrosql = usuariosSql.find(
    //  i => i.email === this.usuario.email && i.contraseña === this.usuario.contrasena
    //);


    //if (registrosql){
    //  this.presentToast('inicio de sesion desde base de datos completado')
    //  await this.dbService.addUsuarioActivo(registrosql)
    //  this.router.navigate(['/home']);
    //} else {
    //  this.presentToast('algo salio terriblemente mla, compruea tus credenciales y vuelve a intentar')
    //}
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
