import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/fireBase/firebase.service'; // Importa el servicio

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.page.html',
  styleUrls: ['./tareas.page.scss'],
  standalone: false
})
export class TareasPage implements OnInit {

  constructor(private firebaseService: FirebaseService) {} // Inyecta el servicio

  ngOnInit() {}

  // Método para agregar un modelo usando el servicio
  push(model: any): Promise<void> {
    return this.firebaseService.push(model); // Llama al método push del servicio
  }
}
