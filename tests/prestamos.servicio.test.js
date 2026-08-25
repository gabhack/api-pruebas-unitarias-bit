/**
 * SOLUCION - Actividades 3, 4 y 5
 */

const {
  crearServicioPrestamos,
} = require('../src/servicios/prestamos.servicio');
const { VALOR_DIA_RETRASO } = require('../src/utils/multas');

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

// Datos que se repiten
const SOCIO_ACTIVO = { id: 1, nombre: 'Ana', email: 'ana@bit.co', activo: true };
const LIBRO_CON_COPIAS = {
  id: 2,
  titulo: 'El Principito',
  isbn: '9780156012195',
  copiasTotales: 2,
  copiasDisponibles: 2,
};
const HOY = new Date('2026-09-01T00:00:00Z');

describe('prestar', () => {
  let librosRepo;
  let sociosRepo;
  let prestamosRepo;
  let servicio;

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

  test('lanza SOCIO_NO_ENCONTRADO si el socio no existe', () => {
    sociosRepo.buscarPorId.mockReturnValue(null);

    expect(() => servicio.prestar(99, 1, HOY)).toThrow('SOCIO_NO_ENCONTRADO');
  });

  test('no toca el repositorio de libros si el socio no existe', () => {
    sociosRepo.buscarPorId.mockReturnValue(null);

    expect(() => servicio.prestar(99, 1, HOY)).toThrow();

    expect(librosRepo.buscarPorId).not.toHaveBeenCalled();
  });

  test('lanza SOCIO_INACTIVO si el socio existe pero esta inactivo', () => {
    sociosRepo.buscarPorId.mockReturnValue({ ...SOCIO_ACTIVO, activo: false });

    expect(() => servicio.prestar(1, 2, HOY)).toThrow('SOCIO_INACTIVO');
  });

  test('lanza LIBRO_NO_ENCONTRADO si el libro no existe', () => {
    sociosRepo.buscarPorId.mockReturnValue(SOCIO_ACTIVO);
    librosRepo.buscarPorId.mockReturnValue(null);

    expect(() => servicio.prestar(1, 999, HOY)).toThrow('LIBRO_NO_ENCONTRADO');
  });

  test('lanza SIN_COPIAS si copiasDisponibles es 0', () => {
    sociosRepo.buscarPorId.mockReturnValue(SOCIO_ACTIVO);
    librosRepo.buscarPorId.mockReturnValue({
      ...LIBRO_CON_COPIAS,
      copiasDisponibles: 0,
    });

    expect(() => servicio.prestar(1, 2, HOY)).toThrow('SIN_COPIAS');
  });

  test('lanza LIMITE_PRESTAMOS si el socio ya tiene 3 prestamos activos', () => {
    sociosRepo.buscarPorId.mockReturnValue(SOCIO_ACTIVO);
    librosRepo.buscarPorId.mockReturnValue(LIBRO_CON_COPIAS);

    // Tres prestamos, todos al dia
    const futuro = new Date('2026-09-20T00:00:00Z');
    prestamosRepo.listarActivosPorSocio.mockReturnValue([
      { id: 1, fechaLimite: futuro },
      { id: 2, fechaLimite: futuro },
      { id: 3, fechaLimite: futuro },
    ]);

    expect(() => servicio.prestar(1, 2, HOY)).toThrow('LIMITE_PRESTAMOS');
  });

  test('lanza TIENE_PRESTAMO_VENCIDO si algun prestamo activo vencio', () => {
    sociosRepo.buscarPorId.mockReturnValue(SOCIO_ACTIVO);
    librosRepo.buscarPorId.mockReturnValue(LIBRO_CON_COPIAS);

    prestamosRepo.listarActivosPorSocio.mockReturnValue([
      { id: 1, fechaLimite: new Date('2026-08-20T00:00:00Z') }, // vencido
    ]);

    expect(() => servicio.prestar(1, 2, HOY)).toThrow('TIENE_PRESTAMO_VENCIDO');
  });

  test('crea el prestamo cuando todo esta en orden', () => {
    sociosRepo.buscarPorId.mockReturnValue(SOCIO_ACTIVO);
    librosRepo.buscarPorId.mockReturnValue(LIBRO_CON_COPIAS);
    prestamosRepo.listarActivosPorSocio.mockReturnValue([]);
    prestamosRepo.crear.mockReturnValue({ id: 10, socioId: 1, libroId: 2 });

    const resultado = servicio.prestar(1, 2, HOY);

    expect(resultado).toEqual({ id: 10, socioId: 1, libroId: 2 });
  });

  test('la fecha limite queda 14 dias despues de hoy', () => {
    sociosRepo.buscarPorId.mockReturnValue(SOCIO_ACTIVO);
    librosRepo.buscarPorId.mockReturnValue(LIBRO_CON_COPIAS);
    prestamosRepo.listarActivosPorSocio.mockReturnValue([]);
    prestamosRepo.crear.mockReturnValue({ id: 10 });

    servicio.prestar(1, 2, HOY);

    // Miramos con que argumentos se llamo al mock
    expect(prestamosRepo.crear).toHaveBeenCalledWith({
      socioId: 1,
      libroId: 2,
      fechaPrestamo: HOY,
      fechaLimite: new Date('2026-09-15T00:00:00Z'),
    });
  });

  test('descuenta una copia disponible del libro', () => {
    sociosRepo.buscarPorId.mockReturnValue(SOCIO_ACTIVO);
    librosRepo.buscarPorId.mockReturnValue(LIBRO_CON_COPIAS); // tiene 2
    prestamosRepo.listarActivosPorSocio.mockReturnValue([]);
    prestamosRepo.crear.mockReturnValue({ id: 10 });

    servicio.prestar(1, 2, HOY);

    expect(librosRepo.actualizarDisponibles).toHaveBeenCalledWith(2, 1);
  });

  test('llama a prestamosRepo.crear exactamente una vez', () => {
    sociosRepo.buscarPorId.mockReturnValue(SOCIO_ACTIVO);
    librosRepo.buscarPorId.mockReturnValue(LIBRO_CON_COPIAS);
    prestamosRepo.listarActivosPorSocio.mockReturnValue([]);
    prestamosRepo.crear.mockReturnValue({ id: 10 });

    servicio.prestar(1, 2, HOY);

    expect(prestamosRepo.crear).toHaveBeenCalledTimes(1);
  });
});

describe('devolver', () => {
  let librosRepo;
  let sociosRepo;
  let prestamosRepo;
  let servicio;

  const PRESTAMO_ABIERTO = {
    id: 10,
    socioId: 1,
    libroId: 2,
    fechaPrestamo: new Date('2026-09-01T00:00:00Z'),
    fechaLimite: new Date('2026-09-15T00:00:00Z'),
    fechaDevolucion: null,
    multa: 0,
  };

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

  test('lanza PRESTAMO_NO_ENCONTRADO si el prestamo no existe', () => {
    prestamosRepo.buscarPorId.mockReturnValue(null);

    expect(() => servicio.devolver(999, HOY)).toThrow('PRESTAMO_NO_ENCONTRADO');
  });

  test('lanza PRESTAMO_YA_DEVUELTO si ya tenia fecha de devolucion', () => {
    prestamosRepo.buscarPorId.mockReturnValue({
      ...PRESTAMO_ABIERTO,
      fechaDevolucion: new Date('2026-09-10T00:00:00Z'),
    });

    expect(() => servicio.devolver(10, HOY)).toThrow('PRESTAMO_YA_DEVUELTO');
  });

  test('registra multa 0 cuando se devuelve a tiempo', () => {
    prestamosRepo.buscarPorId.mockReturnValue(PRESTAMO_ABIERTO);
    librosRepo.buscarPorId.mockReturnValue(LIBRO_CON_COPIAS);

    const aTiempo = new Date('2026-09-14T00:00:00Z');
    servicio.devolver(10, aTiempo);

    expect(prestamosRepo.registrarDevolucion).toHaveBeenCalledWith(
      10,
      aTiempo,
      0
    );
  });

  test('registra la multa correcta cuando se devuelve tarde', () => {
    prestamosRepo.buscarPorId.mockReturnValue(PRESTAMO_ABIERTO);
    librosRepo.buscarPorId.mockReturnValue(LIBRO_CON_COPIAS);

    // Limite: 15 de septiembre. Devuelve el 18 => 3 dias tarde
    const tarde = new Date('2026-09-18T00:00:00Z');
    servicio.devolver(10, tarde);

    expect(prestamosRepo.registrarDevolucion).toHaveBeenCalledWith(
      10,
      tarde,
      3 * VALOR_DIA_RETRASO
    );
  });

  test('devuelve la copia al inventario del libro', () => {
    prestamosRepo.buscarPorId.mockReturnValue(PRESTAMO_ABIERTO);
    librosRepo.buscarPorId.mockReturnValue({
      ...LIBRO_CON_COPIAS,
      copiasDisponibles: 1,
    });

    servicio.devolver(10, new Date('2026-09-14T00:00:00Z'));

    expect(librosRepo.actualizarDisponibles).toHaveBeenCalledWith(2, 2);
  });

  test('no revienta si el libro fue borrado del catalogo', () => {
    prestamosRepo.buscarPorId.mockReturnValue(PRESTAMO_ABIERTO);
    librosRepo.buscarPorId.mockReturnValue(null);

    expect(() =>
      servicio.devolver(10, new Date('2026-09-14T00:00:00Z'))
    ).not.toThrow();

    expect(librosRepo.actualizarDisponibles).not.toHaveBeenCalled();
  });
});
