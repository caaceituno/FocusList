import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor() { }

  async tomarFoto(): Promise<string | undefined> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false, //quitar editor
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        saveToGallery: false
      });
      
      return image.dataUrl;
    } catch (error) {
      console.error('Error al tomar foto:', error);
      return undefined;
    }
  }

  async seleccionarDeGaleria(): Promise<string | undefined> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false, // quitar editor
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos
      });
      
      return image.dataUrl;
    } catch (error) {
      console.error('Error al seleccionar foto:', error);
      return undefined;
    }
  }
}
