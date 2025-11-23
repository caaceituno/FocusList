import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Tarea } from 'src/app/interfaces/tarea';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss'],
  standalone: false
})
export class FormularioComponent {

  // Modelo local del formulario
  @Input() tarea?: Partial<Tarea> | null;

  nuevaTarea: Partial<Tarea> = {
    titulo: '',
    descripcion: '',
    importancia: '',
    fecha: ''
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tarea'] && this.tarea) {
      // Copiar la tarea entrante al modelo local para editar
      this.nuevaTarea = { ...this.tarea };
    } else if (changes['tarea'] && !this.tarea) {
      // Si se limpia la tarea, resetear
      this.resetForm();
    }
  }

  formSubmitted = false;

  // Emitir tarea hacia Home
  @Output() onSubmit = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<void>();

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
    this.resetForm();
  }

  resetForm() {
    this.nuevaTarea = {
      titulo: '',
      descripcion: '',
      importancia: '',
      fecha: ''
    };
    this.formSubmitted = false;
  }
}
