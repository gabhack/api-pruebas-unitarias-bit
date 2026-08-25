const express = require('express');
const {
  listarLibros,
  obtenerLibro,
  crearLibro,
  eliminarLibro,
} = require('../controladores/libros.controlador');
const { verificarToken } = require('../middlewares/auth');

const router = express.Router();

// Rutas publicas
router.get('/', listarLibros);
router.get('/:id', obtenerLibro);

// Rutas protegidas: hay que mandar el header Authorization
router.post('/', verificarToken, crearLibro);
router.delete('/:id', verificarToken, eliminarLibro);

module.exports = router;
