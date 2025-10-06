import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.scss'],
  standalone: false,
})
export class TareasComponent {
  @Input() titulo!: string;
  @Input() color: string = 'light';
  @Input() tareas: any[] = [];
  @Input() mensajeVacio: string = 'No hay tareas.';
}