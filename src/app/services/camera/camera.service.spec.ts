import { TestBed } from '@angular/core/testing';

import { CameraService } from './camera.service';

describe('ServicioCámara', () => {
  let servicio: CameraService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CameraService]
    });
    servicio = TestBed.inject(CameraService);
  });

  it('debe crearse', () => {
    expect(servicio).toBeTruthy();
  });
});
