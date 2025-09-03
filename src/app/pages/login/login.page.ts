import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  usuario: any;
  registroUsuarios: any[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    // Recibir el parámetro y asignarlo a variable
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.usuario = this.router.getCurrentNavigation()?.extras?.state?.['usuario'];
        console.log(this.usuario);
        if (this.usuario) {
          this.registroUsuarios.push(this.usuario);
        }
      }
    });
  }

  ngOnInit(): void {}

  // Esta función se encarga del login
  login() {
    // Buscar el usuario por email
    const usuarioEncontrado = this.registroUsuarios.find(
      (user) => user.email === this.email
    );

    if (!usuarioEncontrado) {
      this.errorMessage = 'El email no está registrado';
      return false;
    }

    // Verificar la contraseña
    if (usuarioEncontrado.password !== this.password) {
      this.errorMessage = 'Contraseña incorrecta para este email';
      return false;
    }

    // Si ambos son correctos
    this.errorMessage = '';
    this.router.navigate(['/paguina']);
    return true;
  }

  // Muestra en consola el email y la contraseña
  consola() {
    console.log('contraseña ' + this.password);
    console.log('email ' + this.email);

    // Muestra todos los usuarios registrados y sus correos y contraseñas
    this.registroUsuarios.forEach((user, index) => {
      console.log(`Usuario ${index + 1}: Email: ${user.email}, Contraseña: ${user.password}`);
    });
  }
}