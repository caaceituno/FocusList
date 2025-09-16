import { tareas } from "./tareas";

export interface usuarios {
  id?: string;        // El id lo añade Firebase automáticamente
  nombre: string;
  apellido: string;
  email: string;
  contraseña: String;
  tareas?: tareas;
}