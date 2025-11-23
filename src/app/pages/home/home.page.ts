import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/registro/usuario.service';
import { User } from 'src/app/interfaces/users';
import { CameraService } from 'src/app/services/camera/camera.service';
import { ActionSheetController } from '@ionic/angular';
import { TareasService } from 'src/app/services/tareas/tareas.service';
import { Tarea } from 'src/app/interfaces/tarea';
import { FormularioComponent } from 'src/app/components/formulario/formulario.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  usuario: User | null = null;
  tareas: Tarea[] = [];
  tareasAtrasadas: Tarea[] = [];
  tareasHoy: Tarea[] = [];
  tareasProximas: Tarea[] = [];
  mostrarFormulario = false;

  nuevaTarea: Partial<Tarea> = { 
    titulo: '', 
    descripcion: '', 
    importancia: '', 
    fecha: '' 
  };

  private tareasSub: any;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private cameraService: CameraService,
    private actionSheetController: ActionSheetController,
    private tareasService: TareasService
  ) {}

  async ngOnInit() {
    await this.cargarUsuario();
    await this.cargarTareas();
    
    this.tareasSub = this.tareasService.getTareasObservable().subscribe(tareas => {
      this.tareas = tareas || [];
      this.clasificarTareas();
    });
  }

  ngOnDestroy() {
    if (this.tareasSub) this.tareasSub.unsubscribe();
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
    if (this.usuario?.id) {
      console.log('Cargando tareas para usuario:', this.usuario.id);
      this.tareas = await this.tareasService.obtenerTareas(this.usuario.id);
      this.clasificarTareas();
    }
  }

  private clasificarTareas() {
    const hoy = this.normalizarFecha(new Date().toISOString());

    this.tareasHoy = this.tareas.filter(t => {
      const f = this.normalizarFecha(t.fecha);
      return f.getTime() === hoy.getTime();
    });

    this.tareasAtrasadas = this.tareas.filter(t => {
      const f = this.normalizarFecha(t.fecha);
      return f < hoy;
    });

    this.tareasProximas = this.tareas.filter(t => {
      const f = this.normalizarFecha(t.fecha);
      return f > hoy;
    });
  }

  private esHoy(fecha: string): boolean {
    const hoy = this.normalizarFecha(new Date().toISOString());
    const f = this.normalizarFecha(fecha);

    return f.getTime() === hoy.getTime();
  }

  private normalizarFecha(fecha: string): Date {
    // Si viene en formato ISO (con T), procesar como ISO
    if (fecha.includes('T')) {
      const f = new Date(fecha);
      return new Date(f.getFullYear(), f.getMonth(), f.getDate());
    }

    // Si viene en formato SQLite: YYYY-MM-DD
    const partes = fecha.split('-');
    return new Date(
      Number(partes[0]),        // año
      Number(partes[1]) - 1,    // mes (0-based)
      Number(partes[2])         // día
    );
  }

  logout() {
    this.usuarioService.logout();
    this.router.navigate(['/login']);
  }

  abrirFormulario() {
    this.mostrarFormulario = true;
  }

  editarTarea(tarea: Tarea) {
    this.nuevaTarea = { ...tarea };
    this.mostrarFormulario = true;
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.nuevaTarea = {
      titulo: '',
      descripcion: '',
      importancia: '',
      fecha: ''
    };
  }

  async guardarTarea() {
    console.log("EL FORMULARIO SÍ SE EJECUTÓ");
    console.log("VALIDACIÓN:", this.validarTarea());
    console.log("NUEVA TAREA:", this.nuevaTarea);
    if (this.usuario?.id && this.validarTarea()) {

      // --- FORMATEAR FECHA CORRECTAMENTE PARA SQLITE (YYYY-MM-DD) ---
      let fechaFormateada = '';

      if (this.nuevaTarea.fecha) {
        const f = new Date(this.nuevaTarea.fecha as string);
        fechaFormateada =
          `${f.getFullYear()}-${(f.getMonth() + 1).toString().padStart(2, '0')}-${f.getDate().toString().padStart(2, '0')}`;
      } else {
        const h = new Date();
        fechaFormateada =
          `${h.getFullYear()}-${(h.getMonth() + 1).toString().padStart(2, '0')}-${h.getDate().toString().padStart(2, '0')}`;
      }

        const tarea: Tarea = {
          id: (this.nuevaTarea as any).id,
          titulo: this.nuevaTarea.titulo || '',
          descripcion: this.nuevaTarea.descripcion || '',
          importancia: this.nuevaTarea.importancia || '',
          fecha: fechaFormateada,
          usuario_id: this.usuario.id
        };

      console.log('Tarea a guardar:', tarea);

      let result = false;

      if (tarea.id) {
        console.log('Actualizando tarea:', tarea);
        result = await this.tareasService.actualizarTarea(tarea, this.usuario.id);
      } else {
        console.log('Guardando nueva tarea:', tarea);
        result = await this.tareasService.guardarTarea(tarea);
      }

      console.log('Resultado operación tarea:', result);

      if (result) {
        await this.cargarTareas();
        this.cerrarFormulario();
      } else {
        console.error('No se pudo guardar/actualizar la tarea');
      }
    }
  }

  private validarTarea(): boolean {
    if (!this.nuevaTarea.titulo || this.nuevaTarea.titulo.trim() === '') return false;
    if (!this.nuevaTarea.fecha) return false;
    return true;
  }

  async cambiarFotoPerfil() {
    const buttons: any[] = [
      {
        text: 'Tomar foto',
        icon: 'camera',
        handler: async () => {
          const foto = await this.cameraService.tomarFoto();
          if (foto && this.usuario) {
            await this.usuarioService.actualizarFotoPerfil(this.usuario.email, foto);
            await this.cargarUsuario();
          }
        }
      },
      {
        text: 'Seleccionar de galería',
        icon: 'images',
        handler: async () => {
          const foto = await this.cameraService.seleccionarDeGaleria();
          if (foto && this.usuario) {
            await this.usuarioService.actualizarFotoPerfil(this.usuario.email, foto);
            await this.cargarUsuario();
          }
        }
      }
    ];

    if (this.usuario?.fotoPerfil) {
      buttons.push({
        text: 'Eliminar foto',
        icon: 'trash',
        role: 'destructive',
        handler: async () => {
          if (this.usuario) {
            await this.usuarioService.eliminarFotoPerfil(this.usuario.email);
            await this.cargarUsuario();
          }
        }
      });
    }

    buttons.push({ text: 'Cancelar', icon: 'close', role: 'cancel' });

    const actionSheet = await this.actionSheetController.create({
      header: 'Foto de perfil',
      buttons
    });
    await actionSheet.present();
  }

  async guardarTareaDesdeComponente(formData: any) {

    this.nuevaTarea = formData;

    await this.guardarTarea();

  }
}
