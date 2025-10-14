import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/registro/usuario.service';
import { Users } from '../../interfaces/users';
import { Storage } from '@ionic/storage-angular'; //para leer las tareas guardadas
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {

  usuario: Users | null = null;
  tareas: any[] = [];
  tareasAtrasadas: any[] = [];
  tareasHoy: any[] = [];
  tareasProximas: any[] = [];
  mostrarFormulario = false;
  nuevaTarea = { titulo: '', descripcion: '', importancia: '', fecha: '' };

  constructor(
    private usuarioService: UsuarioService,
    private storage: Storage,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.storage.create();
    await this.cargarUsuario();
    await this.cargarTareas();
  }

  async ionViewWillEnter() {
    await this.cargarUsuario();
    await this.cargarTareas();
  }

  private async cargarUsuario() {
    this.usuario = await this.usuarioService.getUsuarioActivo();
    console.log('usuario activo en home:', this.usuario);
  }

  private async cargarTareas() {
    const tareasGuardadas = await this.storage.get('tareas') || [];
    this.tareas = tareasGuardadas;
    this.clasificarTareas();
  }

  private clasificarTareas() {
    const hoy = new Date();
    this.tareasAtrasadas = this.tareas.filter(t => new Date(t.fecha) < hoy);
    this.tareasHoy = this.tareas.filter(t => this.esHoy(t.fecha));
    this.tareasProximas = this.tareas.filter(t => new Date(t.fecha) > hoy && !this.esHoy(t.fecha));

    console.log('Atrasadas:', this.tareasAtrasadas);
    console.log('Hoy:', this.tareasHoy);
    console.log('Próximamente:', this.tareasProximas);
  }

  private esHoy(fecha: string): boolean {
    const hoy = new Date();
    const f = new Date(fecha);
    return (
      f.getDate() === hoy.getDate() &&
      f.getMonth() === hoy.getMonth() &&
      f.getFullYear() === hoy.getFullYear()
    );
  }

  logout() {
    this.usuarioService.logout();
    this.router.navigate(['/login']);
  }

  abrirFormulario() {
    this.mostrarFormulario = true;
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.nuevaTarea = { titulo: '', descripcion: '', importancia: '', fecha: '' };
  }

  guardarTarea() {
    //aquí se puede agregar la lógica para guardar la tarea
    console.log('Tarea guardada:', this.nuevaTarea);
    this.cerrarFormulario();
  }
}
