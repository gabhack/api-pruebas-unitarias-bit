const librosRepo = require('../repositorios/libros.repositorio');
const { validarLibroNuevo } = require('../utils/validaciones');

/**
 * Un controlador es una funcion que recibe (req, res) y responde.
 * Para probarlo no necesitamos levantar el servidor: le pasamos
 * un req y un res inventados.
 */

function listarLibros(req, res) {
  const libros = librosRepo.listar();
  return res.status(200).json(libros);
}

function obtenerLibro(req, res) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'ID_INVALIDO' });
  }

  const libro = librosRepo.buscarPorId(id);

  if (!libro) {
    return res.status(404).json({ error: 'LIBRO_NO_ENCONTRADO' });
  }

  return res.status(200).json(libro);
}

function crearLibro(req, res) {
  const resultado = validarLibroNuevo(req.body);

  if (!resultado.valido) {
    return res.status(400).json({ errores: resultado.errores });
  }

  const yaExiste = librosRepo.buscarPorIsbn(req.body.isbn);

  if (yaExiste) {
    return res.status(409).json({ error: 'ISBN_DUPLICADO' });
  }

  const libro = librosRepo.crear(req.body);
  return res.status(201).json(libro);
}

function eliminarLibro(req, res) {
  const id = Number(req.params.id);
  const eliminado = librosRepo.eliminar(id);

  if (!eliminado) {
    return res.status(404).json({ error: 'LIBRO_NO_ENCONTRADO' });
  }

  return res.status(204).send();
}

module.exports = {
  listarLibros,
  obtenerLibro,
  crearLibro,
  eliminarLibro,
};
