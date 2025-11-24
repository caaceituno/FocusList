import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AppComponent } from './app.component';

describe('ComponenteAplicación', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  it('debe crear la aplicación', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const aplicacion = fixture.componentInstance;
    expect(aplicacion).toBeTruthy();
  });

});
