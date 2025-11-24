import emailjs from '@emailjs/browser';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class EmailService {

  serviceID = environment.emailServiceID;
  templateIDReset = environment.emailTemplateID;
  publicKey = environment.emailPublicKey;

  constructor() {}

  async sendPasswordLink(email: string, token: string, name?: string) {

    const params = {
      email: email,
      user_name: name ?? 'usuario',
      token: token
    };

    console.log("DEBUG EmailService → intentando enviar email con params:", params);

    try {
      const res = await emailjs.send(
        this.serviceID,
        this.templateIDReset,
        params,
        this.publicKey
      );

      console.log("DEBUG EmailService → ÉXITO EmailJS:", res);
      return res;

    } catch (error) {
      console.error("DEBUG EmailService → ERROR EmailJS:", error);
      throw error;
    }
  }
}
