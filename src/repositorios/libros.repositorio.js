/**
 * Repositorio de libros: guarda los datos en memoria.
 *
 * En un proyecto real esto seria MongoDB. Aca es un arreglo, para que
 * la practica no dependa de tener una base de datos levantada.
 */

let libros = [];
let siguienteId = 1;

function reiniciar(datosIniciales = []) {
  libros = datosIniciales.map((libro) => ({ ...libro }));
  siguienteId = libros.length > 0 ? Math.max(...libros.map((l) => l.id)) + 1 : 1;
}

function listar() {
  return libros.map((libro) => ({ ...libro }));
}

function buscarPorId(id) {
  const libro = libros.find((l) => l.id === id);
  return libro ? { ...libro } : null;
}

function buscarPorIsbn(isbn) {
  const libro = libros.find((l) => l.isbn === isbn);
  return libro ? { ...libro } : null;
}

function crear({ titulo, autor, isbn, copiasTotales }) {
  const nuevo = {
    id: siguienteId++,
    titulo,
    autor,
    isbn,
    copiasTotales,
    copiasDisponibles: copiasTotales,
  };

  libros.push(nuevo);
  return { ...nuevo };
}

function actualizarDisponibles(id, copiasDisponibles) {
  const libro = libros.find((l) => l.id === id);
  if (!libro) {
    return null;
  }

  libro.copiasDisponibles = copiasDisponibles;
  return { ...libro };
}

function eliminar(id) {
  const cantidadAntes = libros.length;
  libros = libros.filter((l) => l.id !== id);
  return libros.length < cantidadAntes;
}

// Datos de arranque para que la API sirva para algo apenas se levanta
reiniciar([
  {
    id: 1,
    titulo: 'Cien anios de soledad',
    autor: 'Gabriel Garcia Marquez',
    isbn: '9780307474728',
    copiasTotales: 3,
    copiasDisponibles: 3,
  },
  {
    id: 2,
    titulo: 'El Principito',
    autor: 'Antoine de Saint-Exupery',
    isbn: '9780156012195',
    copiasTotales: 2,
    copiasDisponibles: 2,
  },
  {
    id: 3,
    titulo: 'La vorágine',
    autor: 'Jose Eustasio Rivera',
    isbn: '9789583001086',
    copiasTotales: 1,
    copiasDisponibles: 1,
  },
]);

module.exports = {
  reiniciar,
  listar,
  buscarPorId,
  buscarPorIsbn,
  crear,
  actualizarDisponibles,
  eliminar,
};
