import { Usuario } from './usuario';

describe('UsuarioClase', () => {
  it('debe crear una instancia', () => {
    const usuario = new Usuario();
    expect(usuario).toBeTruthy();
  });

  it('debe tener propiedades de usuario', () => {
    const usuario = new Usuario();
    usuario.email = 'test@ejemplo.com';
    usuario.contrasena = 'contrasena123';
    expect(usuario.email).toBe('test@ejemplo.com');
    expect(usuario.contrasena).toBe('contrasena123');
  });
});
