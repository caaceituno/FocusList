

export interface tareas {
  id?: string;        // El id lo añade Firebase automáticamente
  nombre: string;
  descripcion: string;
  fechaDeCreacion: Date;
  fechaVencimiento: Date;
}