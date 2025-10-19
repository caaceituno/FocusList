import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { ToastController } from '@ionic/angular';
import { Dbservice } from '../SQLite/dbservice';
import { Tarea } from '../../interfaces/tarea';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TareasService {
  private _storage: Storage | null = null;
  private tareas = new BehaviorSubject<Tarea[]>([]);

  constructor(
    private storage: Storage,
    private toastController: ToastController,
    private dbService: Dbservice
  ) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  private async ready() {
    if (!this._storage) {
      await this.init();
    }
  }

  async guardarTarea(tarea: Tarea) {
    try {
      await this.ready();
      
      // Guardar en localStorage
      const tareas = await this.obtenerTareas(tarea.usuario_id) || [];
      tareas.unshift(tarea);
      await this._storage?.set(`tareas_${tarea.usuario_id}`, tareas);

      // Guardar en SQLite
      await this.dbService.addTarea(tarea);
      
      this.presentToast('Tarea guardada correctamente');
      return true;
    } catch(error) {
      console.error('Error al guardar tarea:', error);
      this.presentToast('Error al guardar la tarea');
      return false;
    }
  }

  async obtenerTareas(usuario_id: number): Promise<Tarea[]> {
    try {
      await this.ready();
      
      // Obtener de localStorage
      const tareasLocal = await this._storage?.get(`tareas_${usuario_id}`) || [];
      
      // Obtener de SQLite
      const tareasSQLite = await this.dbService.cargarTareas(usuario_id);
      
      // Combinar y eliminar duplicados (priorizar SQLite)
      const tareasMap = new Map<number, Tarea>();
      
      // Primero agregar las tareas de localStorage
      tareasLocal.forEach((tarea: Tarea) => {
        if (tarea.id) {
          tareasMap.set(tarea.id, tarea);
        }
      });
      
      // Luego sobrescribir con las de SQLite (tienen prioridad)
      tareasSQLite.forEach(tarea => {
        if (tarea.id) {
          tareasMap.set(tarea.id, tarea);
        }
      });
      
      const tareasCombinadas = Array.from(tareasMap.values());
      this.tareas.next(tareasCombinadas);
      return tareasCombinadas;
    } catch(error) {
      console.error('Error al obtener tareas:', error);
      return [];
    }
  }

  async actualizarTarea(tarea: Tarea) {
    try {
      await this.ready();
      
      // Actualizar en localStorage
      const tareas = await this.obtenerTareas(tarea.usuario_id) || [];
      const index = tareas.findIndex(t => t.id === tarea.id);
      if (index !== -1) {
        tareas[index] = tarea;
        await this._storage?.set(`tareas_${tarea.usuario_id}`, tareas);
      }

      // Actualizar en SQLite
      await this.dbService.actualizarTarea(tarea);
      
      this.presentToast('Tarea actualizada correctamente');
      return true;
    } catch(error) {
      console.error('Error al actualizar tarea:', error);
      this.presentToast('Error al actualizar la tarea');
      return false;
    }
  }

  async eliminarTarea(id: number, usuario_id: number) {
    try {
      await this.ready();
      
      // Eliminar de localStorage
      const tareas = await this.obtenerTareas(usuario_id) || [];
      const nuevasTareas = tareas.filter(t => t.id !== id);
      await this._storage?.set(`tareas_${usuario_id}`, nuevasTareas);

      // Eliminar de SQLite
      await this.dbService.eliminarTarea(id, usuario_id);
      
      this.presentToast('Tarea eliminada correctamente');
      return true;
    } catch(error) {
      console.error('Error al eliminar tarea:', error);
      this.presentToast('Error al eliminar la tarea');
      return false;
    }
  }

  getTareasObservable() {
    return this.tareas.asObservable();
  }

  private async presentToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }
}