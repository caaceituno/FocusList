import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { UsuarioService } from '../services/registro/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  async canActivate(): Promise<boolean | UrlTree> {
    const user = await this.usuarioService.getUsuarioActivo();
    if (user) {
      return true;  //con usuario logueado va a deja pasar
    } else {
      return this.router.createUrlTree(['/login']);  // sin sesión va a redirigir
    }
  }
}
