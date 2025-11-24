import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminUsersPage } from './admin-users.page';
import { IonicModule } from '@ionic/angular';
import { UsuarioService } from '../../services/registro/usuario.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PáginaAdministradorUsuarios', () => {
  let componente: AdminUsersPage;
  let fixture: ComponentFixture<AdminUsersPage>;

  const servicioUsuarioMock = {
    mostrarUsuarios: jasmine.createSpy('mostrarUsuarios').and.returnValue(Promise.resolve([])),
    editarUsuario: jasmine.createSpy('editarUsuario').and.returnValue(Promise.resolve()),
    borrarUsuario: jasmine.createSpy('borrarUsuario').and.returnValue(Promise.resolve()),
    borrarTodosUsuarios: jasmine.createSpy('borrarTodosUsuarios').and.returnValue(Promise.resolve())
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminUsersPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: UsuarioService, useValue: servicioUsuarioMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(AdminUsersPage);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse', () => {
    expect(componente).toBeTruthy();
  });
});
