import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/registro/usuario.service';
import { Users } from '../../interfaces/users';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {

  usuario: Users | null = null;

  constructor(private usuarioService: UsuarioService) {}

  async ngOnInit() {
    this.usuario = await this.usuarioService.getUsuarioActivo();
    console.log('usuario activo en home:', this.usuario);
  }
}
