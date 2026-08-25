/**
 * ACTIVIDAD 3, 4 y 5 - mocks
 *
 * Este servicio habla con tres repositorios. En una prueba unitaria no
 * queremos los repositorios de verdad: queremos repositorios FALSOS que
 * respondan lo que a nosotros nos sirva para cada caso.
 *
 * Abajo esta armado el primer mock completo, resuelto, para que lo copies.
 */

const { crearServicioPrestamos } = require('../src/servicios/prestamos.servicio');

// --- Fabricas de mocks -------------------------------------------------
// Una funcion que devuelve un repositorio falso nuevo cada vez que se llama.
// Asi cada prueba arranca con mocks limpios.

function crearLibrosRepoFalso() {
  return {
    buscarPorId: jest.fn(),
    actualizarDisponibles: jest.fn(),
  };
}

function crearSociosRepoFalso() {
  return {
    buscarPorId: jest.fn(),
  };
}

function crearPrestamosRepoFalso() {
  return {
    buscarPorId: jest.fn(),
    listarActivosPorSocio: jest.fn(),
    crear: jest.fn(),
    registrarDevolucion: jest.fn(),
  };
}

// --- Pruebas -----------------------------------------------------------

describe('prestar', () => {
  let librosRepo;
  let sociosRepo;
  let prestamosRepo;
  let servicio;

  // beforeEach corre ANTES de cada test de este describe.
  // Sirve para que ninguna prueba herede basura de la anterior.
  beforeEach(() => {
    librosRepo = crearLibrosRepoFalso();
    sociosRepo = crearSociosRepoFalso();
    prestamosRepo = crearPrestamosRepoFalso();

    servicio = crearServicioPrestamos({
      librosRepo,
      sociosRepo,
      prestamosRepo,
    });
  });

  // ---- EJEMPLO RESUELTO ----
  test('lanza SOCIO_NO_ENCONTRADO si el socio no existe', () => {
    // Arrange: le decimos al mock que responda null
    sociosRepo.buscarPorId.mockReturnValue(null);

    // Act + Assert: la funcion tiene que reventar
    expect(() => servicio.prestar(99, 1, new Date())).toThrow(
      'SOCIO_NO_ENCONTRADO'
    );
  });

  // ---- EJEMPLO RESUELTO ----
  test('no toca el repositorio de libros si el socio no existe', () => {
    sociosRepo.buscarPorId.mockReturnValue(null);

    expect(() => servicio.prestar(99, 1, new Date())).toThrow();

    // Esto es lo bonito de los mocks: podemos preguntar si se llamaron
    expect(librosRepo.buscarPorId).not.toHaveBeenCalled();
  });

  // ---- TU TURNO ----
  test.todo('lanza SOCIO_INACTIVO si el socio existe pero esta inactivo');
  test.todo('lanza LIBRO_NO_ENCONTRADO si el libro no existe');
  test.todo('lanza SIN_COPIAS si copiasDisponibles es 0');
  test.todo('lanza LIMITE_PRESTAMOS si el socio ya tiene 3 prestamos activos');
  test.todo('lanza TIENE_PRESTAMO_VENCIDO si algun prestamo activo vencio');
  test.todo('crea el prestamo cuando todo esta en orden');
  test.todo('la fecha limite queda 14 dias despues de hoy');
  test.todo('descuenta una copia disponible del libro');
  test.todo('llama a prestamosRepo.crear exactamente una vez');
});

describe('devolver', () => {
  test.todo('lanza PRESTAMO_NO_ENCONTRADO si el prestamo no existe');
  test.todo('lanza PRESTAMO_YA_DEVUELTO si ya tenia fecha de devolucion');
  test.todo('registra multa 0 cuando se devuelve a tiempo');
  test.todo('registra la multa correcta cuando se devuelve tarde');
  test.todo('devuelve la copia al inventario del libro');
  test.todo('no revienta si el libro fue borrado del catalogo');
});
