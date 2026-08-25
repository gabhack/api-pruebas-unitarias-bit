const librosRepo = require('../repositorios/libros.repositorio');
const sociosRepo = require('../repositorios/socios.repositorio');
const prestamosRepo = require('../repositorios/prestamos.repositorio');
const { crearServicioPrestamos } = require('../servicios/prestamos.servicio');

// Aca si se usan los repositorios de verdad
const servicio = crearServicioPrestamos({
  librosRepo,
  sociosRepo,
  prestamosRepo,
});

// Que codigo HTTP le corresponde a cada error del servicio
const CODIGOS = {
  SOCIO_NO_ENCONTRADO: 404,
  LIBRO_NO_ENCONTRADO: 404,
  PRESTAMO_NO_ENCONTRADO: 404,
  SOCIO_INACTIVO: 403,
  SIN_COPIAS: 409,
  LIMITE_PRESTAMOS: 409,
  TIENE_PRESTAMO_VENCIDO: 409,
  PRESTAMO_YA_DEVUELTO: 409,
};

function listarPrestamos(req, res) {
  return res.status(200).json(prestamosRepo.listar());
}

function prestarLibro(req, res) {
  const { socioId, libroId } = req.body || {};

  if (!Number.isInteger(socioId) || !Number.isInteger(libroId)) {
    return res.status(400).json({ error: 'DATOS_INVALIDOS' });
  }

  try {
    const prestamo = servicio.prestar(socioId, libroId, new Date());
    return res.status(201).json(prestamo);
  } catch (error) {
    const codigo = CODIGOS[error.message] || 500;
    return res.status(codigo).json({ error: error.message });
  }
}

function devolverLibro(req, res) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'ID_INVALIDO' });
  }

  try {
    const prestamo = servicio.devolver(id, new Date());
    return res.status(200).json(prestamo);
  } catch (error) {
    const codigo = CODIGOS[error.message] || 500;
    return res.status(codigo).json({ error: error.message });
  }
}

module.exports = {
  listarPrestamos,
  prestarLibro,
  devolverLibro,
  CODIGOS,
};
