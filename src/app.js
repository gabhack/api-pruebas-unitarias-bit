const express = require('express');
const librosRutas = require('./rutas/libros.rutas');
const prestamosRutas = require('./rutas/prestamos.rutas');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    api: 'Biblioteca BIT+',
    rutas: ['/libros', '/prestamos'],
  });
});

app.use('/libros', librosRutas);
app.use('/prestamos', prestamosRutas);

// Cualquier ruta que no exista
app.use((req, res) => {
  res.status(404).json({ error: 'RUTA_NO_ENCONTRADA' });
});

module.exports = app;
