import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { StartPage } from './start.page';

describe('PáginaInicio', () => {
  let componente: StartPage;
  let fixture: ComponentFixture<StartPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StartPage],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(StartPage);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse', () => {
    expect(componente).toBeTruthy();
  });
});
