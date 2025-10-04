import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/registro/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: false,
})
export class WelcomePage implements OnInit {

  constructor(
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {
  }

  async continuar() {
    await this.usuarioService.setWelcomeShown();
    this.router.navigate(['/login']);
  }

  pages = [
    { front: 'FocusList tu agenda personal para convertir pendientes en planes manejables.', 
      style: {
        backgroundImage: 'url("/assets/img/background02.png"), linear-gradient(0deg, rgba(0, 0, 0, 0.979) 0%, rgba(255, 255, 255, 0) 40%)'
      }
    },
    { front: 'Crea listas y tareas sin complicaciones',
      style: {
        backgroundImage: 'url("/assets/img/background03.png"), linear-gradient(0deg, rgba(0, 0, 0, 0.979) 0%, rgba(255, 255, 255, 0) 40%)'
      }
    },
    { front: 'Organiza tu tiempo de forma efectiva',
      style: {
        backgroundImage: 'url("/assets/img/background04.png"), linear-gradient(0deg, rgba(0, 0, 0, 0.979) 0%, rgba(255, 255, 255, 0) 40%)'
      }
    },
    { front: '¡Comienza ahora!',
      style: {
        backgroundImage: 'url("/assets/img/background01.png"), linear-gradient(0deg, rgba(0, 0, 0, 0.979) 0%, rgba(255, 255, 255, 0) 40%)'
      }
    },
  ];

  currentLocation = 1;
  bookTransform = 'translateX(0%)';

  goNextPage() {
    if (this.currentLocation < this.pages.length) {
      this.currentLocation++;
      this.bookTransform = 'translateX(0%)';
    }
  }

  goPrevPage() {
    if (this.currentLocation > 1) {
      this.currentLocation--;
      this.bookTransform = 'translateX(0%)';
    }
  }

  pagFinal(): boolean {
    return this.currentLocation === this.pages.length;
  }

  pagInicial(): boolean {
    return this.currentLocation === 1;
  }
  
}