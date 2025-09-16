import { tareas } from "./tareas";

export interface usuarios {
  id?: string;        // El id lo añade Firebase automáticamente
  nombre: string;
  apellido: string;
  correo: string;
  contraseña: String;
  tareas: tareas;
}