import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private collectionName = 'models'; // Cambia 'models' por el nombre de tu colección

  constructor(private firestore: AngularFirestore) {}

  // Método para agregar un modelo a la base de datos
  push(model: any): Promise<void> {
    const id = this.firestore.createId(); // Genera un ID único
    return this.firestore.collection(this.collectionName).doc(id).set({
      id,
      ...model,
    });
  }

  // Método para obtener todos los modelos
  getAll(): Observable<any[]> {
    return this.firestore.collection(this.collectionName).valueChanges();
  }
}