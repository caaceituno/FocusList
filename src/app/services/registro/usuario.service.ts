import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Dbservice } from '../SQLite/dbservice';
import { User } from 'src/app/interfaces/users';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private _storage: Storage | null = null;

  constructor(
    private storage: Storage,
    private db: Dbservice
  ) {
    this.init();
  }

  async init() {
    const store = await this.storage.create();
    this._storage = store;
  }

  private async ready() {
    if (!this._storage) {
      await this.init();
    }
  }

  // ===========================================================
  // REGISTRO
  // ===========================================================
  async registrarUsuario(user: User): Promise<boolean> {
    try {
      const id = await this.db.addUsuario(
        user.nombre,
        user.apellido,
        user.email,
        user.contrasena,
        user.fotoPerfil ?? null
      );

      if (!id) {
        console.error("Error: El usuario no obtuvo un ID válido.");
        return false;
      }

      return true;

    } catch (e) {
      console.error("Error registrando usuario:", e);
      return false;
    }
  }

  // ===========================================================
  // LOGIN
  // ===========================================================
  async login(email: string, contrasena: string): Promise<boolean> {
    const usuarios = await this.db.cargarUsuarios();
    const existe = usuarios.find(u => u.email === email && u.contrasena === contrasena);

    if (!existe) return false;

    await this.ready();
    await this._storage?.set('usuarioActivoEmail', email);
    return true;
  }

  // Indicar usuario activo explícitamente
  async setUsuarioActivo(user: User) {
    await this.ready();
    await this._storage?.set('usuarioActivoEmail', user.email);
  }

  // ===========================================================
  // USUARIO ACTIVO
  // ===========================================================
  async getUsuarioActivo(): Promise<User | null> {
    await this.ready();
    const email = await this._storage?.get('usuarioActivoEmail');
    if (!email) return null;

    const usuariosSQLite = await this.db.cargarUsuarios();
    const usuario = usuariosSQLite.find(u => u.email === email);
    if (!usuario) return null;

    return {
      id: usuario.id ?? 0,
      nombre: usuario.nombre ?? '',
      apellido: usuario.apellido ?? '',
      email: usuario.email ?? '',
      contrasena: usuario.contrasena ?? '',
      fotoPerfil: usuario.fotoPerfil ?? undefined
    };
  }

  // ===========================================================
  // AUTENTICACIÓN
  // ===========================================================
  async isAuthenticated(): Promise<boolean> {
    await this.ready();
    const email = await this._storage?.get('usuarioActivoEmail');
    return !!email;
  }

  async logout() {
    await this.ready();
    await this._storage?.remove('usuarioActivoEmail');
  }

  // ===========================================================
  // WELCOME
  // ===========================================================
  async setWelcomeShown() {
    await this.ready();
    await this._storage?.set('welcomeShown', true);
  }

  async hasWelcomeShown(): Promise<boolean> {
    await this.ready();
    const val = await this._storage?.get('welcomeShown');
    return val === true;
  }

  // ===========================================================
  // ADMIN DE USUARIOS
  // ===========================================================
  async mostrarUsuarios(): Promise<User[]> {
    const usuariosSQLite = await this.db.cargarUsuarios();

    return usuariosSQLite.map(u => ({
      id: u.id ?? 0,
      nombre: u.nombre ?? '',
      apellido: u.apellido ?? '',
      email: u.email ?? '',
      contrasena: u.contrasena ?? '',
      fotoPerfil: u.fotoPerfil ?? undefined
    }));
  }

  async guardarUsuario(user: User) {
    return await this.registrarUsuario(user);
  }

  async editarUsuario(usuarioEdit: User) {
    await this.db.actualizarUsuario(
      usuarioEdit.id,
      usuarioEdit.nombre,
      usuarioEdit.apellido,
      usuarioEdit.email,
      usuarioEdit.contrasena,
      usuarioEdit.fotoPerfil ?? null
    );
  }

  async borrarUsuario(email: string) {
    const usuarios = await this.db.cargarUsuarios();
    const usuario = usuarios.find(u => u.email === email);
    if (usuario?.id) {
      await this.db.eliminarUsuario(usuario.id);
    }
  }

  async borrarTodosUsuarios() {
    const usuarios = await this.db.cargarUsuarios();
    for (const u of usuarios) {
      if (u.id) await this.db.eliminarUsuario(u.id);
    }
  }

  // ===========================================================
  // FOTO DE PERFIL
  // ===========================================================
  async actualizarFotoPerfil(email: string, foto: string) {
    const usuarios = await this.db.cargarUsuarios();
    const usuario = usuarios.find(u => u.email === email);
    if (!usuario) return;

    await this.db.actualizarUsuario(
      usuario.id!,
      usuario.nombre!,
      usuario.apellido!,
      usuario.email!,
      usuario.contrasena!,
      foto
    );
  }

  async eliminarFotoPerfil(email: string) {
    const usuarios = await this.db.cargarUsuarios();
    const usuario = usuarios.find(u => u.email === email);
    if (!usuario) return;

    await this.db.actualizarUsuario(
      usuario.id!,
      usuario.nombre!,
      usuario.apellido!,
      usuario.email!,
      usuario.contrasena!,
      null
    );
  }
}
