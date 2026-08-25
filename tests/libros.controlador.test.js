/**
 * SOLUCION - Actividad 6
 */

const librosRepo = require('../src/repositorios/libros.repositorio');
const {
  listarLibros,
  obtenerLibro,
  crearLibro,
  eliminarLibro,
} = require('../src/controladores/libros.controlador');

function crearRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
}

const LIBRO_SEMILLA = {
  id: 1,
  titulo: 'Rayuela',
  autor: 'Julio Cortazar',
  isbn: '9788437604572',
  copiasTotales: 2,
  copiasDisponibles: 2,
};

// Antes de CADA prueba dejamos el repositorio con un solo libro conocido
beforeEach(() => {
  librosRepo.reiniciar([LIBRO_SEMILLA]);
});

describe('listarLibros', () => {
  test('responde 200 con la lista de libros', () => {
    const req = {};
    const res = crearRes();

    listarLibros(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      expect.objectContaining({ titulo: 'Rayuela' }),
    ]);
  });
});

describe('obtenerLibro', () => {
  test('responde 200 y el libro cuando el id existe', () => {
    const req = { params: { id: '1' } };
    const res = crearRes();

    obtenerLibro(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1, titulo: 'Rayuela' })
    );
  });

  test('responde 404 con LIBRO_NO_ENCONTRADO cuando el id no existe', () => {
    const req = { params: { id: '999' } };
    const res = crearRes();

    obtenerLibro(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'LIBRO_NO_ENCONTRADO' });
  });

  test('responde 400 con ID_INVALIDO cuando el id no es un numero', () => {
    const req = { params: { id: 'abc' } };
    const res = crearRes();

    obtenerLibro(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'ID_INVALIDO' });
  });
});

describe('crearLibro', () => {
  test('responde 201 con el libro creado cuando los datos son validos', () => {
    const req = {
      body: {
        titulo: 'El Aleph',
        autor: 'Jorge Luis Borges',
        isbn: '9788499089515',
        copiasTotales: 1,
      },
    };
    const res = crearRes();

    crearLibro(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        titulo: 'El Aleph',
        copiasDisponibles: 1,
      })
    );
  });

  test('responde 400 y la lista de errores cuando los datos son invalidos', () => {
    const req = { body: { titulo: '', autor: '', isbn: 'x', copiasTotales: 0 } };
    const res = crearRes();

    crearLibro(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errores: [
        'TITULO_INVALIDO',
        'AUTOR_INVALIDO',
        'ISBN_INVALIDO',
        'COPIAS_INVALIDAS',
      ],
    });
  });

  test('responde 409 con ISBN_DUPLICADO si el ISBN ya existe', () => {
    const req = {
      body: {
        titulo: 'Rayuela (otra edicion)',
        autor: 'Julio Cortazar',
        isbn: '9788437604572', // el mismo de la semilla
        copiasTotales: 1,
      },
    };
    const res = crearRes();

    crearLibro(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ error: 'ISBN_DUPLICADO' });
  });

  test('no guarda nada en el repositorio cuando los datos son invalidos', () => {
    const req = { body: {} };
    const res = crearRes();

    crearLibro(req, res);

    // Sigue habiendo un solo libro: el de la semilla
    expect(librosRepo.listar()).toHaveLength(1);
  });
});

describe('eliminarLibro', () => {
  test('responde 204 sin cuerpo cuando el libro existia', () => {
    const req = { params: { id: '1' } };
    const res = crearRes();

    eliminarLibro(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test('responde 404 cuando el libro no existia', () => {
    const req = { params: { id: '999' } };
    const res = crearRes();

    eliminarLibro(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'LIBRO_NO_ENCONTRADO' });
  });
});
