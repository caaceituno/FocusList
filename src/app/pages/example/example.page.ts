import { Component } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-example',
  templateUrl: './example.page.html',
  styleUrls: ['./example.page.scss'],
})
export class ExamplePage {
  constructor(private firebaseService: FirebaseService) {}

  addModel() {
    const newModel = {
      name: 'Tarea',
      description: 'Tarea a realizar',
      decchaCreacion: new Date(),
      completed: Boolean(false),
      nombre: String(''),
      prioridad: String('Media'),
    };

    this.firebaseService.push(newModel).then(() => {
      console.log('Modelo agregado con éxito');
    }).catch((error) => {
      console.error('Error al agregar el modelo:', error);
    });
  }
}