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

  public database!: SQLiteObject;

  tblusuarios = `
    CREATE TABLE IF NOT EXISTS usuario (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      nombre TEXT NOT NULL, 
      apellido TEXT NOT NULL, 
      email TEXT NOT NULL, 
      contrasena TEXT NOT NULL,
      fotoPerfil TEXT
    );
  `;

  tblusuariosActivos = `
    CREATE TABLE IF NOT EXISTS usuariosActivos (
      id INTEGER,
      FOREIGN KEY (id) REFERENCES usuario(id)
    );
  `;

  tbltareas = `
    CREATE TABLE IF NOT EXISTS tareas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      descripcion TEXT,
      importancia TEXT,
      fecha TEXT,
      usuario_id INTEGER,
      FOREIGN KEY (usuario_id) REFERENCES usuario(id)
    );
  `;

  listaUsuarios = new BehaviorSubject<Usuario[]>([]);
  listaUsuariosActivos = new BehaviorSubject<Usuario[]>([]);
  listaTareas = new BehaviorSubject<Tarea[]>([]);
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private sqlite: SQLite,
    private platform: Platform,
    private toastController: ToastController
  ) {
    this.platform.ready().then(() => {
      this.crearBD();
    });
  }

  // ============================================================
  // INICIALIZACIÓN
  // ============================================================
  crearBD() {
    this.sqlite.create({
      name: 'focus_list_DB',
      location: 'default'
    }).then((db: SQLiteObject) => {
      console.log('SQLite creado');
      this.database = db;
      this.crearTablas();
    })
    .catch(err => console.error('Error creando BD', err));
  }

  async crearTablas() {
    try {
      await this.database.executeSql(this.tblusuarios, []);
      await this.database.executeSql(this.tblusuariosActivos, []);
      await this.database.executeSql(this.tbltareas, []);
      console.log('Tablas listas');
      await this.cargarUsuarios();
      await this.cargarUsuariosActivos();
      this.isDbReady.next(true);
    } catch (err) {
      console.error('Error creando tablas:', err);
    }
  }

  // ============================================================
  // USUARIOS
  // ============================================================
  async cargarUsuarios(): Promise<Usuario[]> {
    const res = await this.database.executeSql('SELECT * FROM usuario', []);
    const items: Usuario[] = [];

    for (let i = 0; i < res.rows.length; i++) {
      items.push({
        id: res.rows.item(i).id,
        nombre: res.rows.item(i).nombre,
        apellido: res.rows.item(i).apellido,
        email: res.rows.item(i).email,
        contrasena: res.rows.item(i).contrasena,
        fotoPerfil: res.rows.item(i).fotoPerfil
      });
    }

    this.listaUsuarios.next(items);
    return items;
  }

  async cargarUsuariosActivos(): Promise<Usuario[]> {
    const res = await this.database.executeSql(
      'SELECT * FROM usuario u INNER JOIN usuariosActivos ua ON u.id = ua.id',
      []
    );

    const items: Usuario[] = [];

    for (let i = 0; i < res.rows.length; i++) {
      items.push({
        id: res.rows.item(i).id,
        nombre: res.rows.item(i).nombre,
        apellido: res.rows.item(i).apellido,
        email: res.rows.item(i).email,
        contrasena: res.rows.item(i).contrasena,
        fotoPerfil: res.rows.item(i).fotoPerfil
      });
    }

    this.listaUsuariosActivos.next(items);
    return items;
  }

  async addUsuario(nombre: string, apellido: string, email: string, contrasena: string, fotoPerfil: any = null): Promise<number> {
    try {
      const res = await this.database.executeSql(
        'INSERT INTO usuario(nombre, apellido, email, contrasena, fotoPerfil) VALUES (?, ?, ?, ?, ?)',
        [nombre, apellido, email, contrasena, fotoPerfil]
      );

      await this.cargarUsuarios();
      return res.insertId ?? 0;
    } catch (error) {
      console.error('Error en addUsuario:', error);
      return 0;
    }
  }

  async addUsuarioActivo(id: number) {
    await this.database.executeSql(
      'INSERT INTO usuariosActivos(id) VALUES (?)',
      [id]
    );
    await this.cargarUsuariosActivos();
  }

  async actualizarUsuario(id: number, nombre: string, apellido: string, email: string, contrasena: string, fotoPerfil: any) {
    await this.database.executeSql(
      'UPDATE usuario SET nombre=?, apellido=?, email=?, contrasena=?, fotoPerfil=? WHERE id=?',
      [nombre, apellido, email, contrasena, fotoPerfil, id]
    );
    await this.cargarUsuarios();
  }

  async eliminarUsuario(id: number) {
    await this.database.executeSql('DELETE FROM usuario WHERE id=?', [id]);
    await this.cargarUsuarios();
  }

  // ============================================================
  // TAREAS
  // ============================================================
  async cargarTareas(usuario_id: number): Promise<Tarea[]> {
    const res = await this.database.executeSql(
      'SELECT * FROM tareas WHERE usuario_id = ? ORDER BY fecha DESC',
      [usuario_id]
    );

    const items: Tarea[] = [];

    for (let i = 0; i < res.rows.length; i++) {
      items.push({
        id: res.rows.item(i).id,
        titulo: res.rows.item(i).titulo,
        descripcion: res.rows.item(i).descripcion,
        importancia: res.rows.item(i).importancia,
        fecha: res.rows.item(i).fecha,
        usuario_id: res.rows.item(i).usuario_id,
      });
    }

    this.listaTareas.next(items);
    return items;
  }

  async addTarea(tarea: Tarea): Promise<boolean> {
    try {
      await this.database.executeSql(
        'INSERT INTO tareas(titulo, descripcion, importancia, fecha, usuario_id) VALUES (?, ?, ?, ?, ?)',
        [tarea.titulo, tarea.descripcion, tarea.importancia, tarea.fecha, tarea.usuario_id]
      );

      await this.cargarTareas(tarea.usuario_id);
      return true;
    } catch (error) {
      console.error('Error al agregar tarea:', error);
      return false;
    }
  }

  async eliminarTarea(id: number, usuario_id: number): Promise<boolean> {
    try {
      await this.database.executeSql('DELETE FROM tareas WHERE id=?', [id]);
      await this.cargarTareas(usuario_id);
      return true;
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
      return false;
    }
  }
  
  async actualizarTarea(tarea: Tarea, usuario_id: number): Promise<boolean> {
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
      
      // Si se actualizó alguna fila, recargar las tareas
      if (result.rowsAffected > 0) {
        await this.cargarTareas(usuario_id);
        return true;
      } else {
        console.log('No se actualizó la tarea');
        return false;
      }
    } catch (error) {
      console.error('Error al actualizar la tarea:', error);
      return false;
    }
  }

  fetchTareas(): Observable<Tarea[]> {
    return this.listaTareas.asObservable();
  }

}
