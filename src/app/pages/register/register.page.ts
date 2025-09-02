import { Component, input, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';


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
    contraseña: '',
  }

  field: string="";

  errorMessage: String = ''

  constructor(private router: Router) {}
  ngOnInit(): void {}

  // Método registrar

  validar(){
    if (this.validateModel(this.usuario)) {
      //si tengo los datos navego hacia la siguiente page
      //agrego la creación de un parámetro para enviar los datos a la otra page
      let navigationExtras : NavigationExtras = {
        state: {usuario: this.usuario}
      };
      //invoco el llamado a la siguiente page
      this.router.navigate(['/login'], navigationExtras);

    }
  }

    validateModel(model: any){
    //Recorro modelo 'usuario' revisando las entradas del Object
    for (var [key,value] of Object.entries(model)) {
      //si el value es "" retorno false e indico el nombre del campo que falta
      if (value == "") {
        this.field = key;
        return false;
      }      
    }
    return true;
  }
}
