import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { ToastController } from '@ionic/angular';
import { Users } from '../../interfaces/users';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private _storage: Storage | null = null;
  usuarios: Users[] = [];

  constructor(private storage: Storage, private toastController: ToastController) {}

  private async ready() {
    if (!this._storage) {
      this._storage = await this.storage.create();
    }
  }

  async guardarUsuario(user: Users) {
    await this.ready();
    const usuarios = (await this._storage?.get('usuarios')) || [];
    const existe = usuarios.find((u: Users) => u.email === user.email);

    if (!existe) {
      usuarios.unshift(user);
      await this._storage?.set('usuarios', usuarios);
      this.presentToast('Usuario registrado');
    } else {
      this.presentToast('El usuario ya existe');
    }
  }

  async mostrarUsuarios(): Promise<Users[]> {
    await this.ready();
    return (await this._storage?.get('usuarios')) || [];
  }

  async setUsuarioActivo(user: Users) {
    await this.ready();
    await this._storage?.set('usuarioActivo', user);
  }

  async getUsuarioActivo(): Promise<Users | null> {
    await this.ready();
    return await this._storage?.get('usuarioActivo');
  }

  async isAuthenticated(): Promise<boolean> {
    await this.ready();
    const user = await this.getUsuarioActivo();
    return !!user;
  }

  async setWelcomeShown() {
    await this.ready();
    await this._storage?.set('welcomeShown', true);
  }

  async hasWelcomeShown(): Promise<boolean> {
    await this.ready();
    return (await this._storage?.get('welcomeShown')) === true;
  }

  private async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'top'
    });
    await toast.present();
  }

  async borrarUsuario(email: string): Promise<void> {
    await this.ready();
    const usuarios = (await this._storage?.get('usuarios')) || [];
    const nuevosUsuarios = usuarios.filter((u: Users) => u.email !== email);
    await this._storage?.set('usuarios', nuevosUsuarios);

    //si el usuario borrado era el activo se elimina
    const usuarioActivo = await this._storage?.get('usuarioActivo');
    if (usuarioActivo && usuarioActivo.email === email) {
      await this._storage?.remove('usuarioActivo');
    }
  }

  async borrarTodosUsuarios(): Promise<void> {
    await this.ready();
    await this._storage?.set('usuarios', []);
  }

  async editarUsuario(usuarioEditado: Users): Promise<void> {
    await this.ready();
    const usuarios = (await this._storage?.get('usuarios')) || [];
    const nuevosUsuarios = usuarios.map((u: Users) =>
      u.email === usuarioEditado.email ? usuarioEditado : u
    );
    await this._storage?.set('usuarios', nuevosUsuarios);

    //actualiza el usuario activo si es el que se está editando
    const usuarioActivo = await this._storage?.get('usuarioActivo');
    if (usuarioActivo && usuarioActivo.email === usuarioEditado.email) {
      await this._storage?.set('usuarioActivo', usuarioEditado);
    }
  }

  logout(): void {
    localStorage.removeItem('usuario');
  }
}
