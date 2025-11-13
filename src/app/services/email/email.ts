import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';

emailjs.init('uALMtOh_mwmZDQgwm');

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  
  async enviarYNotificar(datos: any) {
    //ejemplooooo datos = { to_email: 'destinatario@ejemplo.com', from_name: 'Benja', message: 'Hola' }
    //siganme en instagram @oke.dux
    try {
      const res = await emailjs.send('service_id', 'template_id', datos);
      //ELIMINAR TODOS LOS CONSOLE.LOG EN PRODUCCION NO DEJAR NADAAAAA
      console.log('Email enviado', res);
      // mostrar toast / feedback al usuario
      return true;
    } catch (error) {
      console.error('Error enviando email', error);
      // mostrar error al usuario
      return false;
    }
  }
}
