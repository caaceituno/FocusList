import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TareasService } from '../../services/tareas/tareas.service';
import { Tarea } from 'src/app/interfaces/tarea';

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.scss'],
  standalone: false,
})
export class TareasComponent {
  @Input() titulo!: string;
  @Input() color: string = 'light';
  @Input() tareas: Tarea[] = [];
  @Input() mensajeVacio: string = 'No hay tareas.';

  @Output() borrar = new EventEmitter<Tarea>();
  @Output() editar = new EventEmitter<Tarea>();

  constructor(private tareasService: TareasService) {}

  editarTarea(tarea: Tarea) {
    this.editar.emit(tarea);
  }

  borrarTarea(tarea: Tarea): void {
    if (!tarea?.id) {
      console.error('La tarea no tiene id:', tarea);
      return;
    }

    this.tareasService.eliminarTarea(tarea.id, tarea.usuario_id).then((success: boolean) => {
      if (success) {
        console.log('Tarea eliminada correctamente');
        this.borrar.emit(tarea); // opcional: notificar al padre
      } else {
        console.log('Error al eliminar la tarea');
      }
    }).catch(err => {
      console.error('Error al eliminar la tarea (promise):', err);
    });
  }
}