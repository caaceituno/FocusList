import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TestPage } from './test.page';
import { IonicModule } from '@ionic/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ClimaService } from '../../services/clima/clima.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PáginaPrueba', () => {
  let componente: TestPage;
  let fixture: ComponentFixture<TestPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TestPage],
      imports: [IonicModule.forRoot(), HttpClientTestingModule],
      providers: [
        ClimaService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(TestPage);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('debe crearse', () => {
    expect(componente).toBeTruthy();
  });
});
