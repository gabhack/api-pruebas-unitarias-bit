/**
 * Repositorio de socios de la biblioteca. Tambien en memoria.
 */

let socios = [];
let siguienteId = 1;

function reiniciar(datosIniciales = []) {
  socios = datosIniciales.map((socio) => ({ ...socio }));
  siguienteId = socios.length > 0 ? Math.max(...socios.map((s) => s.id)) + 1 : 1;
}

function listar() {
  return socios.map((socio) => ({ ...socio }));
}

function buscarPorId(id) {
  const socio = socios.find((s) => s.id === id);
  return socio ? { ...socio } : null;
}

function buscarPorEmail(email) {
  const socio = socios.find((s) => s.email === email);
  return socio ? { ...socio } : null;
}

function crear({ nombre, email }) {
  const nuevo = {
    id: siguienteId++,
    nombre,
    email,
    activo: true,
  };

  socios.push(nuevo);
  return { ...nuevo };
}

reiniciar([
  { id: 1, nombre: 'Ana Restrepo', email: 'ana@bit.co', activo: true },
  { id: 2, nombre: 'Carlos Mejia', email: 'carlos@bit.co', activo: true },
  { id: 3, nombre: 'Sofia Duarte', email: 'sofia@bit.co', activo: false },
]);

module.exports = {
  reiniciar,
  listar,
  buscarPorId,
  buscarPorEmail,
  crear,
};
