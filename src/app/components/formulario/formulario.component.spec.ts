import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { FormularioComponent } from './formulario.component';

describe('ComponenteFormulario', () => {
  let componente: FormularioComponent;
  let fixture: ComponentFixture<FormularioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FormularioComponent ],
      imports: [IonicModule.forRoot(), FormsModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(FormularioComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('debe crearse', () => {
    expect(componente).toBeTruthy();
  });
});
