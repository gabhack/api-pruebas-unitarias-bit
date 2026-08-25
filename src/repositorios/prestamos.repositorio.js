/**
 * Repositorio de prestamos. Tambien en memoria.
 *
 * Un prestamo se ve asi:
 * {
 *   id: 1,
 *   socioId: 1,
 *   libroId: 2,
 *   fechaPrestamo: Date,
 *   fechaLimite: Date,
 *   fechaDevolucion: null,   // null = todavia lo tiene
 *   multa: 0
 * }
 */

let prestamos = [];
let siguienteId = 1;

function reiniciar(datosIniciales = []) {
  prestamos = datosIniciales.map((prestamo) => ({ ...prestamo }));
  siguienteId =
    prestamos.length > 0 ? Math.max(...prestamos.map((p) => p.id)) + 1 : 1;
}

function listar() {
  return prestamos.map((prestamo) => ({ ...prestamo }));
}

function buscarPorId(id) {
  const prestamo = prestamos.find((p) => p.id === id);
  return prestamo ? { ...prestamo } : null;
}

/** Prestamos que el socio todavia no ha devuelto */
function listarActivosPorSocio(socioId) {
  return prestamos
    .filter((p) => p.socioId === socioId && p.fechaDevolucion === null)
    .map((prestamo) => ({ ...prestamo }));
}

function crear({ socioId, libroId, fechaPrestamo, fechaLimite }) {
  const nuevo = {
    id: siguienteId++,
    socioId,
    libroId,
    fechaPrestamo,
    fechaLimite,
    fechaDevolucion: null,
    multa: 0,
  };

  prestamos.push(nuevo);
  return { ...nuevo };
}

function registrarDevolucion(id, fechaDevolucion, multa) {
  const prestamo = prestamos.find((p) => p.id === id);
  if (!prestamo) {
    return null;
  }

  prestamo.fechaDevolucion = fechaDevolucion;
  prestamo.multa = multa;
  return { ...prestamo };
}

reiniciar([]);

module.exports = {
  reiniciar,
  listar,
  buscarPorId,
  listarActivosPorSocio,
  crear,
  registrarDevolucion,
};
