import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { UsuarioService } from '../services/registro/usuario.service';

export const StartGuard: CanActivateFn = async (): Promise<boolean | UrlTree> => {
  const usuarioService = inject(UsuarioService);
  const router = inject(Router);

  const welcomeShown = await usuarioService.hasWelcomeShown();
  const isLogged = await usuarioService.isAuthenticated();

  console.log('[StartGuard] welcomeShown:', welcomeShown, 'isLogged:', isLogged);

  if (!welcomeShown) {
    console.log('[StartGuard] → Primera vez: mostrando welcome');
    return router.createUrlTree(['/welcome']);
  }

  if (isLogged) {
    console.log('[StartGuard] → Usuario logueado: redirigiendo a home');
    return router.createUrlTree(['/home']);
  }

  console.log('[StartGuard] → Sin sesión: redirigiendo a login');
  return router.createUrlTree(['/login']);
};
