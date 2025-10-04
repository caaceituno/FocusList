import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { UsuarioService } from '../services/registro/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private usuarioService: UsuarioService, private router: Router) {}

  async canActivate(): Promise<boolean | UrlTree> {
    const auth = await this.usuarioService.isAuthenticated();
    console.log('[AuthGuard] isAuthenticated() devolvió:', auth);

    if (auth) {
      console.log('[AuthGuard] Sesión activa, entra a la ruta');
      return true;  //con usuario logueado va a deja pasar
    } else {
      console.log('[AuthGuard] No hay sesión, redirigiendo a /login');
      return this.router.createUrlTree(['/login']);  // sin sesión va a redirigir
    }
  }
}
