/**
 * ACTIVIDAD 6 - probar controladores sin levantar el servidor
 *
 * Un controlador es solo una funcion que recibe (req, res).
 * Entonces le inventamos un req y un res y listo. No hace falta Express,
 * ni un puerto, ni Postman.
 *
 * El truco del res: cada metodo devuelve el mismo objeto res, para que
 * res.status(200).json({...}) funcione encadenado.
 */

const librosRepo = require('../src/repositorios/libros.repositorio');
const {
  listarLibros,
  obtenerLibro,
  crearLibro,
  eliminarLibro,
} = require('../src/controladores/libros.controlador');

/** Crea un res falso que registra todo lo que le hacen */
function crearRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
}

describe('listarLibros', () => {
  beforeEach(() => {
    librosRepo.reiniciar([
      {
        id: 1,
        titulo: 'Rayuela',
        autor: 'Julio Cortazar',
        isbn: '9788437604572',
        copiasTotales: 2,
        copiasDisponibles: 2,
      },
    ]);
  });

  // ---- EJEMPLO RESUELTO ----
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
  test.todo('responde 200 y el libro cuando el id existe');
  test.todo('responde 404 con LIBRO_NO_ENCONTRADO cuando el id no existe');
  test.todo('responde 400 con ID_INVALIDO cuando el id no es un numero');
});

describe('crearLibro', () => {
  test.todo('responde 201 con el libro creado cuando los datos son validos');
  test.todo('responde 400 y la lista de errores cuando los datos son invalidos');
  test.todo('responde 409 con ISBN_DUPLICADO si el ISBN ya existe');
  test.todo('no guarda nada en el repositorio cuando los datos son invalidos');
});

describe('eliminarLibro', () => {
  test.todo('responde 204 sin cuerpo cuando el libro existia');
  test.todo('responde 404 cuando el libro no existia');
});
