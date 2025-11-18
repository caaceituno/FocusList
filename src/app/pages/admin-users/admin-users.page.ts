import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/registro/usuario.service';
import { User } from '../../interfaces/users';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.page.html',
  styleUrls: ['./admin-users.page.scss'],
  standalone: false,
})
export class AdminUsersPage implements OnInit {
  usuarios: User[] = [];

  // PROPIEDADES PARA EL FORMULARIO DE EDICIÓN
  showEditModal = false;
  usuarioEdit: User = { id: 0, nombre: '', apellido: '', email: '', contrasena: '' };

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  async cargarUsuarios() {
    this.usuarios = await this.usuarioService.mostrarUsuarios();
  }

  editarUsuario(usuario: User) {
    this.usuarioEdit = { ...usuario }; // Copia los datos
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
  }

  async guardarEdicionUsuario() {
    await this.usuarioService.editarUsuario(this.usuarioEdit);
    this.showEditModal = false;
    await this.cargarUsuarios();
  }

  async borrarUsuario(email: string) {
    await this.usuarioService.borrarUsuario(email);
    await this.cargarUsuarios();
  }

  async borrarTodosUsuarios() {
    if (confirm('¿Seguro que quieres borrar TODOS los usuarios?')) {
      await this.usuarioService.borrarTodosUsuarios();
      await this.cargarUsuarios();
    }
  }
}
