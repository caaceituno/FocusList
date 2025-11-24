import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform, ToastController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Usuario } from 'src/app/clases/usuario';
import { Tarea } from 'src/app/interfaces/tarea';

@Injectable({
  providedIn: 'root'
})
export class Dbservice {

  private database!: SQLiteObject;

  private dbReady!: Promise<void>;
  private dbReadyResolve!: () => void;

  constructor(
    private sqlite: SQLite,
    private platform: Platform,
    private toastController: ToastController
  ) {
    // Crear promesa de DB lista
    this.dbReady = new Promise((resolve) => {
      this.dbReadyResolve = resolve;
    });

    this.platform.ready().then(() => {
      this.crearBD();
    });
  }

  // ============================================================
  // INICIALIZACIÓN
  // ============================================================
  private async crearBD() {
    try {
      const db = await this.sqlite.create({
        name: 'focus_list_DB',
        location: 'default'
      });

      console.log('SQLite creado');
      this.database = db;

      await this.crearTablas();

      // BD lista → liberar bloqueo
      this.dbReadyResolve();

    } catch (err) {
      console.error('Error creando BD', err);
    }
  }

  private async crearTablas() {
    try {
      await this.database.executeSql(`
        CREATE TABLE IF NOT EXISTS usuario (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT NOT NULL,
          apellido TEXT NOT NULL,
          email TEXT NOT NULL,
          contrasena TEXT NOT NULL,
          fotoPerfil TEXT
        )`, []);

      await this.database.executeSql(`
        CREATE TABLE IF NOT EXISTS usuariosActivos (
          id INTEGER,
          FOREIGN KEY (id) REFERENCES usuario(id)
        )`, []);

      await this.database.executeSql(`
        CREATE TABLE IF NOT EXISTS tareas (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          titulo TEXT NOT NULL,
          descripcion TEXT,
          importancia TEXT,
          fecha TEXT,
          usuario_id INTEGER,
          FOREIGN KEY (usuario_id) REFERENCES usuario(id)
        )`, []);

      console.log('Tablas listas');

    } catch (err) {
      console.error('Error creando tablas:', err);
    }
  }

  // ============================================================
  // USUARIOS
  // ============================================================
  async cargarUsuarios(): Promise<Usuario[]> {
    await this.dbReady;

    const res = await this.database.executeSql('SELECT * FROM usuario', []);

    const items: Usuario[] = [];
    for (let i = 0; i < res.rows.length; i++) {
      items.push(res.rows.item(i));
    }
    return items;
  }

  async cargarUsuariosActivos(): Promise<Usuario[]> {
    await this.dbReady;

    const res = await this.database.executeSql(
      'SELECT * FROM usuario u INNER JOIN usuariosActivos ua ON u.id = ua.id',
      []
    );

    const items: Usuario[] = [];
    for (let i = 0; i < res.rows.length; i++) {
      items.push(res.rows.item(i));
    }
    return items;
  }

  async addUsuario(nombre: string, apellido: string, email: string, contrasena: string, fotoPerfil: any = null): Promise<number> {
    await this.dbReady;

    const res = await this.database.executeSql(
      'INSERT INTO usuario(nombre, apellido, email, contrasena, fotoPerfil) VALUES (?, ?, ?, ?, ?)',
      [nombre, apellido, email, contrasena, fotoPerfil]
    );

    return res.insertId ?? 0;
  }

  async addUsuarioActivo(id: number) {
    await this.dbReady;

    await this.database.executeSql('INSERT INTO usuariosActivos(id) VALUES (?)', [id]);
  }

  async actualizarUsuario(id: number, nombre: string, apellido: string, email: string, contrasena: string, fotoPerfil: any) {
    await this.dbReady;

    await this.database.executeSql(
      'UPDATE usuario SET nombre=?, apellido=?, email=?, contrasena=?, fotoPerfil=? WHERE id=?',
      [nombre, apellido, email, contrasena, fotoPerfil, id]
    );
  }

  async eliminarUsuario(id: number) {
    await this.dbReady;
    await this.database.executeSql('DELETE FROM usuario WHERE id=?', [id]);
  }

  // ============================================================
  // TAREAS
  // ============================================================
  async cargarTareas(usuario_id: number): Promise<Tarea[]> {
    await this.dbReady;

    const res = await this.database.executeSql(
      'SELECT * FROM tareas WHERE usuario_id = ? ORDER BY fecha DESC',
      [usuario_id]
    );

    const items: Tarea[] = [];
    for (let i = 0; i < res.rows.length; i++) {
      items.push(res.rows.item(i));
    }

    return items;
  }

  async addTarea(tarea: Tarea): Promise<boolean> {
    await this.dbReady;

    try {
      await this.database.executeSql(
        'INSERT INTO tareas(titulo, descripcion, importancia, fecha, usuario_id) VALUES (?, ?, ?, ?, ?)',
        [tarea.titulo, tarea.descripcion, tarea.importancia, tarea.fecha, tarea.usuario_id]
      );

      return true;
    } catch (error) {
      console.error('Error al agregar tarea:', error);
      return false;
    }
  }

  async eliminarTarea(id: number, usuario_id: number): Promise<boolean> {
    await this.dbReady;

    try {
      await this.database.executeSql('DELETE FROM tareas WHERE id=?', [id]);
      return true;

    } catch (error) {
      console.error('Error al eliminar tarea:', error);
      return false;
    }
  }

  async actualizarTarea(tarea: Tarea, usuario_id: number): Promise<boolean> {
    await this.dbReady;

    try {
      const query = `
        UPDATE tareas
        SET titulo = ?, descripcion = ?, importancia = ?, fecha = ?
        WHERE id = ? AND usuario_id = ?
      `;

      const result = await this.database.executeSql(query, [
        tarea.titulo,
        tarea.descripcion,
        tarea.importancia,
        tarea.fecha,
        tarea.id,
        usuario_id
      ]);

      return result.rowsAffected > 0;

    } catch (error) {
      console.error('Error al actualizar tarea:', error);
      return false;
    }
  }
}
