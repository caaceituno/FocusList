import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { UsuarioService } from '../services/registro/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class WelcomeGuard implements CanActivate {

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  async canActivate(): Promise<boolean | UrlTree> {
    const alreadyShown = await this.usuarioService.AnimacionVista();
    if (alreadyShown) {
      //si ya se mostró manda directo a start
      return this.router.createUrlTree(['/start']);
    } else {
      //deja pasar la primera vez
      return true;
    }
  }
}