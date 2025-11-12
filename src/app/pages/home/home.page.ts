import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/registro/usuario.service';
import { Users } from 'src/app/interfaces/users';
import { CameraService } from 'src/app/services/camera/camera.service';
import { ActionSheetController } from '@ionic/angular';
import { TareasService } from 'src/app/services/tareas/tareas.service';
import { Tarea } from 'src/app/interfaces/tarea';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  usuario: Users | null = null;
  tareas: Tarea[] = [];
  tareasAtrasadas: Tarea[] = [];
  tareasHoy: Tarea[] = [];
  tareasProximas: Tarea[] = [];
  mostrarFormulario = false;
  nuevaTarea: Partial<Tarea> = { titulo: '', descripcion: '', importancia: '', fecha: '' };

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
    
    // Suscribirse a los cambios en las tareas
    this.tareasSub = this.tareasService.getTareasObservable().subscribe(tareas => {
      if (tareas && tareas.length > 0) {
        this.tareas = tareas;
        this.clasificarTareas();
      }
    });
  }

  ngOnDestroy() {
    if (this.tareasSub) {
      this.tareasSub.unsubscribe();
    }
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
      console.log('Tareas cargadas:', this.tareas);
      this.clasificarTareas();
    } else {
      console.warn('No hay usuario activo para cargar tareas');
    }
  }

  private clasificarTareas() {
    const hoy = new Date();
    this.tareasAtrasadas = this.tareas.filter(t => new Date(t.fecha) < hoy && !this.esHoy(t.fecha));
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
    this.nuevaTarea = { 
      titulo: '', 
      descripcion: '', 
      importancia: '', 
      fecha: '' 
    };
  }

  async guardarTarea() {
    if (this.usuario?.id && this.validarTarea()) {
      console.log('Iniciando guardar tarea...');
      console.log('Usuario ID:', this.usuario.id);
      
      // Asegurarse de que la fecha esté en formato ISO
      const fechaFormateada = this.nuevaTarea.fecha ? 
        new Date(this.nuevaTarea.fecha).toISOString() : 
        new Date().toISOString();

      const tarea: Tarea = {
        titulo: this.nuevaTarea.titulo || '',
        descripcion: this.nuevaTarea.descripcion || '',
        importancia: this.nuevaTarea.importancia || '',
        fecha: fechaFormateada,
        usuario_id: this.usuario.id
      };
      
      console.log('Tarea a guardar:', tarea);
      
      const guardado = await this.tareasService.guardarTarea(tarea);
      console.log('Resultado del guardado:', guardado);
      
      if (guardado) {
        console.log('Tarea guardada, recargando lista...');
        await this.cargarTareas();
        console.log('Lista de tareas recargada');
        this.cerrarFormulario();
        console.log('Formulario cerrado');
      } else {
        console.error('No se pudo guardar la tarea');
      }
    } else {
      console.warn('Usuario sin ID o validación fallida');
    }
  }

  private validarTarea(): boolean {
    console.log('Validando tarea:', this.nuevaTarea);
    
    if (!this.nuevaTarea.titulo || this.nuevaTarea.titulo.trim() === '') {
      console.warn('Título vacío');
      return false;
    }
    if (!this.nuevaTarea.fecha) {
      console.warn('Fecha no seleccionada');
      return false;
    }
    console.log('Validación exitosa');
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
      },
    ];

    //si ya existe una foto se agrega "Eliminar foto"
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
}
