import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { ToastController } from '@ionic/angular';
import { Users } from '../../interfaces/users';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuarios: Users[] = [];
  private _storage: Storage | null = null;

  constructor(private storage: Storage, private toastController: ToastController) {
    this.init();
    this.cargarUsuarios();
  }
  
  private async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  async cargarUsuarios() {
    const data = await this.storage.get('usuarios');
    if (data) {
      this.usuarios = data;
    }
  }

  async guardarUsuario(user: Users) {
    const existe = this.usuarios.find(u => u.email === user.email);
    if (!existe) {
      this.usuarios.unshift(user);
      await this._storage?.set('usuarios', this.usuarios);
      this.presentToast('Usuario registrado');
    } else {
      this.presentToast('El usuario ya existe');
    }
  }

  async mostrarUsuarios() {
    return this.usuarios;
  }

  async eliminarUsuario(email: string) {
    this.usuarios = this.usuarios.filter(u => u.email !== email);
    await this._storage?.set('usuarios', this.usuarios);
    this.presentToast('Usuario eliminado');
  }

  async borrarBD() {
    await this._storage?.clear();
    this.usuarios = [];
    this.presentToast('Base de datos de usuarios eliminada');
  }

  private async presentToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      position: 'top',
      duration: 2000,
      color: 'medium'
    });
    toast.present();
  }

  async setUsuarioActivo(user: Users) {
    await this._storage?.set('usuarioActivo', user);
  }

  async getUsuarioActivo(): Promise<Users | null> {
    return await this._storage?.get('usuarioActivo');
  }

  async logout() {
    await this._storage?.remove('usuarioActivo');
  }
}
