import { Injectable } from '@angular/core';
import { Dbservice } from '../SQLite/dbservice';
import { BehaviorSubject, Observable } from 'rxjs';
import { Tarea } from 'src/app/interfaces/tarea';

@Injectable({
  providedIn: 'root'
})
export class TareasService {

  private tareas$ = new BehaviorSubject<Tarea[]>([]);

  constructor(private db: Dbservice) {}

  // Observador para que Home reciba actualizaciones en tiempo real
  getTareasObservable(): Observable<Tarea[]> {
    return this.tareas$.asObservable();
  }

  // Obtener tareas desde SQLite
  async obtenerTareas(usuario_id: number): Promise<Tarea[]> {
    const tareas = await this.db.cargarTareas(usuario_id);
    this.tareas$.next(tareas);
    return tareas;
  }

  // Guardar nueva tarea en SQLite
  async guardarTarea(tarea: Tarea): Promise<boolean> {
    const ok = await this.db.addTarea(tarea);

    if (ok === true) {
      const tareasActualizadas = await this.db.cargarTareas(tarea.usuario_id);
      this.tareas$.next(tareasActualizadas);
      return true;
    }

    return false;
  }

  // Eliminar tarea
  async eliminarTarea(id: number, usuario_id: number): Promise<boolean> {
    const ok = await this.db.eliminarTarea(id, usuario_id);

    if (ok === true) {
      const tareas = await this.db.cargarTareas(usuario_id);
      this.tareas$.next(tareas);
      return true;
    }

    return false;
  }

  // Actualizar tarea
  async actualizarTarea(tarea: Tarea, usuario_id: number): Promise<boolean> {
    const ok = await this.db.actualizarTarea(tarea, usuario_id);

    if (ok === true) {
      const tareasActualizadas = await this.db.cargarTareas(usuario_id);
      this.tareas$.next(tareasActualizadas);
      return true;
    }

    return false;
  }
}
