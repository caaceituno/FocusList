import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WelcomePage } from './welcome.page';
import { IonicModule } from '@ionic/angular';
import { UsuarioService } from '../../services/registro/usuario.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PáginaBienvenida', () => {
  let componente: WelcomePage;
  let fixture: ComponentFixture<WelcomePage>;

  const servicioUsuarioMock = {
    setWelcomeShown: jasmine.createSpy('setWelcomeShown').and.returnValue(Promise.resolve())
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WelcomePage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: UsuarioService, useValue: servicioUsuarioMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(WelcomePage);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse', () => {
    expect(componente).toBeTruthy();
  });
});
