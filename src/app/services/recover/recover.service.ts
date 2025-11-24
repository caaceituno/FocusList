import { Injectable } from '@angular/core';
import { UsuarioService } from '../registro/usuario.service';
import { EmailService } from '../email/email.service';

@Injectable({
  providedIn: 'root'
})
export class RecoverService {

  constructor(
    private usuarioService: UsuarioService,
    private emailService: EmailService
  ) {}

  async recoverPassword(email: string) {

    console.log("DEBUG RecoverService → email recibido:", email);

    const usuario = await this.usuarioService.buscarPorEmail(email);
    console.log("DEBUG RecoverService → usuario encontrado:", usuario);

    if (!usuario) {
      return { ok: false, msg: 'No existe una cuenta con ese correo.' };
    }

    const token = crypto.randomUUID();
    console.log("DEBUG RecoverService → token generado:", token);

    await this.usuarioService.guardarToken(email, token);
    console.log("DEBUG RecoverService → token guardado en BD");

    try {
      console.log("DEBUG RecoverService → enviando correo...");
      await this.emailService.sendPasswordLink(email, token, usuario.nombre);
      console.log("DEBUG RecoverService → correo enviado");
      return { ok: true, msg: 'Código enviado. Revisa tu correo.' };

    } catch (error) {
      console.error("DEBUG RecoverService → ERROR ENVIANDO EMAIL:", error);
      return { ok: false, msg: 'Error enviando correo (ver consola).' };
    }
  }
}
