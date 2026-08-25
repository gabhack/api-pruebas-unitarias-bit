const express = require('express');
const {
  listarPrestamos,
  prestarLibro,
  devolverLibro,
} = require('../controladores/prestamos.controlador');
const { verificarToken } = require('../middlewares/auth');

const router = express.Router();

router.get('/', listarPrestamos);
router.post('/', verificarToken, prestarLibro);
router.put('/:id/devolucion', verificarToken, devolverLibro);

module.exports = router;
