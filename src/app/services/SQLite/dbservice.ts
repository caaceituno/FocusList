import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform, ToastController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario } from '../../clases/usuario';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})


export class Dbservice {
  public database!: SQLiteObject;
  tblusuarios:string = "CREATE TABLE IF NOT EXISTS usuario(id INTEGERPRIMARY KEY autoincrement, nombre VARCHAR(50) NOT NULL, apellido VARCHAR(50) NOT NULL, email VARCHAR(50) NOT NULL, contraseña VARCHAR(50) NOT NULL ;";

  listaUsuarios = new BehaviorSubject<Usuario[]>([]);
  private isDbReady:
    BehaviorSubject<boolean> = new BehaviorSubject(false);
  
  constructor(private sqlite: SQLite,
    private platform: Platform,
    public toastController: ToastController) {
    this.crearBD();
  }

  crearBD() {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'focus_list_DB',
        location: 'default'
      }).then((db: SQLiteObject) => {
        this.database = db;
        this.presentToast("BD creada");
        //llamo a crear la(s) tabla(s)
        this.crearTablas();
      }).catch(e => this.presentToast(e));
    })
  }

  async crearTablas() {
  try {
    await this.database.executeSql(this.tblusuarios, []);
    this.presentToast("Tabla creada");
    this.cargarUsuarios();
    this.isDbReady.next(true);
    } catch (error) {
    this.presentToast("Error en Crear Tabla: " + error);
    }
  }

  cargarUsuarios() {
    let items: Usuario[] = [];
    this.database.executeSql('SELECT * FROM usuario', [])
    .then(res => {
      if (res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) {
        items.push({
          id: res.rows.item(i).id,
          nombre: res.rows.item(i).nombre,
          apellido: res.rows.item(i).apellido,
          email: res.row.item(i).email,
          contraseña: res.row.item(i).contraseña
        });
        }
      }
    });
    this.listaUsuarios.next(items);
  }

  async buscarusuario(id:any){
    await this.database.executeSql('select * from usuario where id=?',[id])
  }

  async addUsuario (nombre:any,apellido:any, email:any, contraseña:any){
    let data = [nombre, apellido, email, contraseña]
    await this.database.executeSql('INSERT INTO usuario(nombre,pellido,email,contraseña) values (?,?,?,?)',data);
    this.cargarUsuarios();
  }

  async actualizarUsuario(id:any,nombre:any,apellido:any, email:any, contraseña:any){
    let data = [id,nombre,apellido,email,contraseña];
    await this.database.executeSql('UPDATE usuario SET nombre=?, apellido=?, email=?, contrseña=? WHERE id=?',data);
    this.cargarUsuarios();

  }

  async eliminarUsuario(id: any) {
    await this.database.executeSql('DELETE FROM usuario WHERE id=?', [id]);
    this.cargarUsuarios();
  }

  dbState() {
    return this.isDbReady.asObservable();
  }

  fetcUsuario(): Observable<Usuario[]> {
    return this.listaUsuarios.asObservable();
  }


  async presentToast(mensaje: string) {
      const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000
    });
    toast.present();
  }



}
