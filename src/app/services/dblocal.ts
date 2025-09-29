import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Iagenda } from '../interface/itareas';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class Dblocal {

  tareas: Iagenda[] = [];

  private _storage: Storage | null=null;

  constructor(private storage: Storage, public toasController: ToastController) { 
    this.init();
    this.cargarTareas();

  }

  async init(){
    const storage = await this.storage.create();
    this._storage = storage
  }

  async cargarTareas(){
    const misTareas = await this.storage.get('tarea');
    if(misTareas){
      this.tareas=misTareas
    }
  }

  guardarTarea (nombre: string, nro: number, fecha: Date, listo: boolean){
    const existe = this.tareas.find (c => c.intId === nro);
    if (!existe){
      this.tareas.unshift({ strNombre:nombre, intId:nro, dateFechaCreacion: fecha, booleanListo: listo});
      this._storage?.set('tarea',this.tareas);
      this.presentToast("tarea guardada");
    }else{
      this.presentToast("tarea ya listada")
    }
  }

  async borrarDB (){
    await this._storage?.clear();
    this.tareas = [];
    console.log (this.tareas.length);
    this.presentToast("se a eliminado la base de datos")
  }

  async presentToast(mensaje:string){
    const toast = await this.toasController.create({
      message: mensaje,
      translucent: true,
      color: 'medium',
      position: 'top',
      duration : 2000

    })
    toast.present();
  }


}
