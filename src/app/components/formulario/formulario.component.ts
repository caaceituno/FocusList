import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss'],
  standalone: false
})
export class FormularioComponent {

  // Modelo local del formulario
  nuevaTarea = {
    titulo: '',
    descripcion: '',
    importancia: '',
    fecha: ''
  };

  // Emitir tarea hacia Home
  @Output() onSubmit = new EventEmitter<any>();

  constructor() {}

  enviarFormulario() {
    this.onSubmit.emit(this.nuevaTarea);
  }
}
