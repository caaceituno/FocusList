import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Users } from 'src/app/interfaces/users';
import { ToastController } from '@ionic/angular';
import { Dbservice } from '../SQLite/dbservice';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private _storage: Storage | null = null;
  usuarios: Users[] = [];

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

  async guardarUsuario(user: Users) {
    try {
      await this.ready();
      const usuarios = (await this._storage?.get('usuarios')) || [];
      const existe = usuarios.find((u: Users) => u.email === user.email);

      if (!existe) {
        // Guardar en localStorage (solo en la lista de usuarios)
        usuarios.unshift(user);
        await this._storage?.set('usuarios', usuarios);

        // Guardar en SQLite (solo en la tabla usuario)
        await this.dbService.addUsuario(user.nombre, user.apellido, user.email, user.contrasena);
        
        this.presentToast('Usuario registrado correctamente');
      } else {
        this.presentToast('El usuario ya existe');
      }
    } catch(error) {
      console.error('Error al guardar usuario: ', error);
    }
  }

  async mostrarUsuarios(): Promise<Users[]> {
    await this.ready();
    return (await this._storage?.get('usuarios')) || [];
  }

  async setUsuarioActivo(user: Users) {
    try {
      await this.ready();
      // Guardar en localStorage como usuario activo
      await this._storage?.set('usuarioActivo', user);
      
      // Buscar el usuario en SQLite por email para obtener su ID
      const usuariosSQLite = await this.dbService.cargarUsuarios();
      const usuarioSQLite = usuariosSQLite.find(u => u.email === user.email);
      
      if (usuarioSQLite?.id) {
        // Primero eliminar cualquier usuario activo existente
        const usuariosActivos = await this.dbService.cargarUsuariosActivos();
        for (const activo of usuariosActivos) {
          if (activo.id) {
            await this.dbService.eliminarUsuarioActivo(activo.id);
          }
        }
        
        // Agregar el nuevo usuario activo
        await this.dbService.addUsuarioActivo(usuarioSQLite.id);
      }
    } catch(error) {
      console.error('Error al establecer usuario activo: ', error);
    }
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

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  async borrarUsuario(email: string): Promise<void> {
    try {
      await this.ready();
      // Borrar de localStorage
      const usuarios = (await this._storage?.get('usuarios')) || [];
      const nuevosUsuarios = usuarios.filter((u: Users) => u.email !== email);
      await this._storage?.set('usuarios', nuevosUsuarios);

      // Si el usuario borrado era el activo se elimina
      const usuarioActivo = await this._storage?.get('usuarioActivo');
      if (usuarioActivo && usuarioActivo.email === email) {
        await this._storage?.remove('usuarioActivo');
      }

      // Borrar de SQLite
      const usuariosSQLite = await this.dbService.cargarUsuarios();
      const usuarioSQLite = usuariosSQLite.find(u => u.email === email);
      if (usuarioSQLite?.id) {
        await this.dbService.eliminarUsuarioActivo(usuarioSQLite.id);
        await this.dbService.eliminarUsuario(usuarioSQLite.id);
      }
    } catch(error) {
      console.error('Error al borrar usuario: ', error);
    }
  }

  async borrarTodosUsuarios(): Promise<void> {
    try {
      await this.ready();
      // Borrar de localStorage
      await this._storage?.set('usuarios', []);
      await this._storage?.remove('usuarioActivo');

      // Borrar de SQLite
      const usuarios = await this.dbService.cargarUsuarios();
      for (const usuario of usuarios) {
        if (usuario.id) {
          await this.dbService.eliminarUsuarioActivo(usuario.id);
          await this.dbService.eliminarUsuario(usuario.id);
        }
      }
    } catch(error) {
      console.error('Error al borrar todos los usuarios: ', error);
    }
  }

  async editarUsuario(usuarioEditado: Users): Promise<void> {
    try {
      await this.ready();
      // Actualizar en localStorage
      const usuarios = (await this._storage?.get('usuarios')) || [];
      const nuevosUsuarios = usuarios.map((u: Users) =>
        u.email === usuarioEditado.email ? usuarioEditado : u
      );
      await this._storage?.set('usuarios', nuevosUsuarios);

      // Actualizar el usuario activo si es el que se está editando
      const usuarioActivo = await this._storage?.get('usuarioActivo');
      if (usuarioActivo && usuarioActivo.email === usuarioEditado.email) {
        await this._storage?.set('usuarioActivo', usuarioEditado);
      }

      // Actualizar en SQLite
      const usuariosSQLite = await this.dbService.cargarUsuarios();
      const usuarioSQLite = usuariosSQLite.find(u => u.email === usuarioEditado.email);
      if (usuarioSQLite?.id) {
        await this.dbService.actualizarUsuario(
          usuarioSQLite.id,
          usuarioEditado.nombre,
          usuarioEditado.apellido,
          usuarioEditado.email,
          usuarioEditado.contrasena
        );
      }
    } catch(error) {
      console.error('Error al editar usuario: ', error);
    }
  }

  async logout(): Promise<void> {
    try {
      // Eliminar usuario activo de localStorage
      await this._storage?.remove('usuarioActivo');

      // Eliminar de la tabla usuariosActivos en SQLite
      const usuarioActivo = await this._storage?.get('usuarioActivo');
      if (usuarioActivo) {
        // Buscar el ID del usuario en SQLite
        const usuariosSQLite = await this.dbService.cargarUsuarios();
        const usuarioSQLite = usuariosSQLite.find(u => u.email === usuarioActivo.email);
        if (usuarioSQLite?.id) {
          // Solo eliminar de la tabla usuariosActivos
          await this.dbService.eliminarUsuarioActivo(usuarioSQLite.id);
        }
      }
    } catch(error) {
      console.error('Error al cerrar sesión: ', error);
    }
  }

  async actualizarFotoPerfil(email: string, fotoPerfil: string): Promise<void> {
    try {
      await this.ready();
      
      // Actualizar en localStorage
      const usuarios = (await this._storage?.get('usuarios')) || [];
      const nuevosUsuarios = usuarios.map((u: Users) =>
        u.email === email ? { ...u, fotoPerfil } : u
      );
      await this._storage?.set('usuarios', nuevosUsuarios);

      // Actualizar usuario activo si es el mismo
      const usuarioActivo = await this._storage?.get('usuarioActivo');
      if (usuarioActivo && usuarioActivo.email === email) {
        await this._storage?.set('usuarioActivo', { ...usuarioActivo, fotoPerfil });
      }

      // Actualizar en SQLite
      const usuariosSQLite = await this.dbService.cargarUsuarios();
      const usuarioSQLite = usuariosSQLite.find(u => u.email === email);
      if (usuarioSQLite?.id) {
        await this.dbService.actualizarUsuario(
          usuarioSQLite.id,
          usuarioSQLite.nombre,
          usuarioSQLite.apellido,
          usuarioSQLite.email,
          usuarioSQLite.contrasena,
          fotoPerfil
        );
      }
      
      this.presentToast('Foto de perfil actualizada');
    } catch(error) {
      console.error('Error al actualizar foto de perfil: ', error);
    }
  }

  async eliminarFotoPerfil(email: string): Promise<void> {
    try {
      await this.ready();

      // Actualizar en Storage
      const usuarios = (await this._storage?.get('usuarios')) || [];
      const nuevosUsuarios = usuarios.map((u: Users) =>
        u.email === email ? { ...u, fotoPerfil: undefined } : u
      );
      await this._storage?.set('usuarios', nuevosUsuarios);

      // Actualizar usuario activo
      const usuarioActivo = await this._storage?.get('usuarioActivo');
      if (usuarioActivo && usuarioActivo.email === email) {
        await this._storage?.set('usuarioActivo', { ...usuarioActivo, fotoPerfil: undefined });
      }

      // Actualizar en SQLite (poner null)
      const usuariosSQLite = await this.dbService.cargarUsuarios();
      const usuarioSQLite = usuariosSQLite.find((u: any) => u.email === email);
      if (usuarioSQLite?.id) {
        await this.dbService.actualizarUsuario(
          usuarioSQLite.id,
          usuarioSQLite.nombre,
          usuarioSQLite.apellido,
          usuarioSQLite.email,
          usuarioSQLite.contrasena,
          null // limpiar foto en BD
        );
      }

      await this.presentToast('Foto de perfil eliminada');
    } catch (e) {
      console.error('Error al eliminar foto de perfil:', e);
    }
  }
}
