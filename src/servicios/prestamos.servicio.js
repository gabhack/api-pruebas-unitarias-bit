const { diasDeRetraso, calcularMulta, sumarDias } = require('../utils/multas');

// Un socio no puede tener mas de 3 libros al tiempo
const MAX_PRESTAMOS_ACTIVOS = 3;

// Cada prestamo dura 14 dias
const DIAS_DE_PRESTAMO = 14;

/**
 * Crea el servicio de prestamos.
 *
 * Fijate en algo importante: este servicio NO importa los repositorios,
 * se los pasan por parametro. Eso se llama inyeccion de dependencias
 * y es lo que va a permitir, en las pruebas, entregarle repositorios
 * falsos en vez de los de verdad.
 *
 * @param {object} deps
 * @param {object} deps.librosRepo
 * @param {object} deps.sociosRepo
 * @param {object} deps.prestamosRepo
 */
function crearServicioPrestamos({ librosRepo, sociosRepo, prestamosRepo }) {
  /**
   * Presta un libro a un socio.
   *
   * @param {number} socioId
   * @param {number} libroId
   * @param {Date} hoy - se recibe por parametro para que las pruebas
   *                     puedan decidir que dia es hoy
   * @returns {object} el prestamo creado
   */
  function prestar(socioId, libroId, hoy = new Date()) {
    const socio = sociosRepo.buscarPorId(socioId);
    if (!socio) {
      throw new Error('SOCIO_NO_ENCONTRADO');
    }

    if (!socio.activo) {
      throw new Error('SOCIO_INACTIVO');
    }

    const libro = librosRepo.buscarPorId(libroId);
    if (!libro) {
      throw new Error('LIBRO_NO_ENCONTRADO');
    }

    if (libro.copiasDisponibles < 1) {
      throw new Error('SIN_COPIAS');
    }

    const activos = prestamosRepo.listarActivosPorSocio(socioId);

    if (activos.length >= MAX_PRESTAMOS_ACTIVOS) {
      throw new Error('LIMITE_PRESTAMOS');
    }

    const tieneVencido = activos.some(
      (prestamo) => prestamo.fechaLimite.getTime() < hoy.getTime()
    );

    if (tieneVencido) {
      throw new Error('TIENE_PRESTAMO_VENCIDO');
    }

    const prestamo = prestamosRepo.crear({
      socioId,
      libroId,
      fechaPrestamo: hoy,
      fechaLimite: sumarDias(hoy, DIAS_DE_PRESTAMO),
    });

    librosRepo.actualizarDisponibles(libroId, libro.copiasDisponibles - 1);

    return prestamo;
  }

  /**
   * Registra la devolucion de un libro y calcula la multa.
   *
   * @param {number} prestamoId
   * @param {Date} fechaDevolucion
   * @returns {object} el prestamo cerrado, con su multa
   */
  function devolver(prestamoId, fechaDevolucion = new Date()) {
    const prestamo = prestamosRepo.buscarPorId(prestamoId);
    if (!prestamo) {
      throw new Error('PRESTAMO_NO_ENCONTRADO');
    }

    if (prestamo.fechaDevolucion !== null) {
      throw new Error('PRESTAMO_YA_DEVUELTO');
    }

    const dias = diasDeRetraso(prestamo.fechaLimite, fechaDevolucion);
    const multa = calcularMulta(dias);

    const libro = librosRepo.buscarPorId(prestamo.libroId);
    if (libro) {
      librosRepo.actualizarDisponibles(
        prestamo.libroId,
        libro.copiasDisponibles + 1
      );
    }

    return prestamosRepo.registrarDevolucion(prestamoId, fechaDevolucion, multa);
  }

  return { prestar, devolver };
}

module.exports = {
  crearServicioPrestamos,
  MAX_PRESTAMOS_ACTIVOS,
  DIAS_DE_PRESTAMO,
};
