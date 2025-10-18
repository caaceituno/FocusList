import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform, ToastController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario } from 'src/app/clases/usuario';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})

export class Dbservice {
  public database!: SQLiteObject;
  tblusuarios:string = "CREATE TABLE IF NOT EXISTS usuario (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(50) NOT NULL, apellido VARCHAR(50) NOT NULL, email VARCHAR(50) NOT NULL, contraseña VARCHAR(50) NOT NULL, fotoPerfil TEXT);";
  tblusuariosActivos:string = "CREATE TABLE IF NOT EXISTS usuariosActivos (id INTEGER,FOREIGN KEY (id) REFERENCES usuario(id));";


  listaUsuarios = new BehaviorSubject<Usuario[]>([]);
  listaUsuariosActivos = new BehaviorSubject<Usuario[]>([]);
  private isDbReady:
    BehaviorSubject<boolean> = new BehaviorSubject(false);
 
  constructor(private sqlite: SQLite,
    private platform: Platform,
    public toastController: ToastController) {
    this.platform.ready().then(() => {
      this.crearBD();
    });
  }


  crearBD() {
    this.sqlite.create({
      name: 'focus_list_DB',
      location: 'default'
    }).then((db: SQLiteObject) => {
      this.database = db;
      this.presentToast("BD creada");
      console.log("Base de datos creada");
      this.crearTablas();
    }).catch(e => this.presentToast("Error creando BD: " + e));
  }


async crearTablas() {
  try {
    await this.database.executeSql(this.tblusuarios, []);
    await this.database.executeSql(this.tblusuariosActivos, []);
    this.presentToast("Tablas creadas correctamente");
    this.cargarUsuarios();
    this.cargarUsuariosActivos();
    this.isDbReady.next(true);
  } catch (error) {
    console.error("❌ Error al crear tablas:", error);
    this.presentToast("Error en Crear Tabla: " + JSON.stringify(error));
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
          email: res.rows.item(i).email,
          contraseña: res.rows.item(i).contraseña
        });
        }
      }
    });
    this.listaUsuarios.next(items);


    return items;
  }


  async cargarUsuariosActivos (){
    let usuariosActivos: Usuario[] = [];
    this.database.executeSql('SELECT * FROM usuario u INNER JOIN usuariosActivos ua ON u.id = ua.id;',[])
    .then(res =>{
      if(res.rows.length > 0) {
        for(let i= 0; i < res.rows.length; i++)
          usuariosActivos.push({
            id: res.rows.item(i).id,
            nombre: res.rows.item(i).nombre,
            apellido: res.rows.item(i).apellido,
            email: res.row.item(i).email,
            contraseña: res.row.item(i).contraseña
          });
      }
    })
    this.listaUsuariosActivos.next(usuariosActivos);


    return usuariosActivos;
  };


  async buscarusuario(id:any){
    await this.database.executeSql('select * from usuario where id=?',[id])
  }


  async buscarUsuarioActivo(id:any){
    await this.database.executeSql('SELECT * FROM usuario u INNER JOIN usuariosActivos ua ON u.id = ua.id where ua.id=?;',[id])
  }


  async addUsuario (nombre:any,apellido:any, email:any, contraseña:any, fotoPerfil?: any) {
    try {
      let data = [nombre, apellido, email, contraseña, fotoPerfil || null];
      await this.database.executeSql('INSERT INTO usuario(nombre, apellido, email, contraseña, fotoPerfil) values (?,?,?,?,?)', data);
      this.cargarUsuarios();
    } catch (error) {
      console.error('Error al agregar usuario en sqlite:', error);
    }
  }
  
  async addUsuarioActivo (id:any){
    await this.database.executeSql('INSERT INTO usuariosActivos(id) values (?)',id)
    this.cargarUsuariosActivos();
  }


  async actualizarUsuario(id:any,nombre:any,apellido:any, email:any, contraseña:any, fotoPerfil?: any) {
    let data = [nombre, apellido, email, contraseña, fotoPerfil || null, id];
    await this.database.executeSql('UPDATE usuario SET nombre=?, apellido=?, email=?, contraseña=?, fotoPerfil=? WHERE id=?', data);
    this.cargarUsuarios();


  }


  async eliminarUsuario(id: any) {
    await this.database.executeSql('DELETE FROM usuario WHERE id=?', [id]);
    this.cargarUsuarios();
  }


  async eliminarUsuarioActivo(id:any){
    await this.database.executeSql('DELETE FROM usuariosActivos WHERE id=?',[id]);
    this.cargarUsuariosActivos();
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
