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

  formSubmitted = false;

  // Emitir tarea hacia Home
  @Output() onSubmit = new EventEmitter<any>();

  constructor() {}

  enviarFormulario() {
    this.formSubmitted = true; // Marca el formulario como enviado
    console.log('Formulario enviado:', this.nuevaTarea); // Depuración

    if (!this.nuevaTarea.titulo || !this.nuevaTarea.importancia || !this.nuevaTarea.fecha) {
      console.log('Faltan campos obligatorios'); // Depuración
      return;
    }

    // Emitir la tarea hacia el componente padre (Home)
    console.log('Formulario válido, emitiendo tarea:', this.nuevaTarea);
    this.onSubmit.emit({ ...this.nuevaTarea });

    // Resetear el formulario local y el estado
    this.nuevaTarea = {
      titulo: '',
      descripcion: '',
      importancia: '',
      fecha: ''
    };
    this.formSubmitted = false;
  }
}
