/**
 * ACTIVIDAD 7 - probar un middleware
 *
 * Un middleware recibe (req, res, next). Lo interesante aca es `next`:
 * es una funcion que le pasamos nosotros, y podemos preguntarle a Jest
 * si el middleware la llamo o no.
 *
 * Regla mental: si el middleware deja pasar, next() se llamo y res.status NO.
 * Si el middleware bloquea, res.status se llamo y next() NO.
 */

const { verificarToken, TOKEN_VALIDO } = require('../src/middlewares/auth');

function crearRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('verificarToken', () => {
  // ---- EJEMPLO RESUELTO ----
  test('deja pasar cuando el token es correcto', () => {
    const req = { headers: { authorization: `Bearer ${TOKEN_VALIDO}` } };
    const res = crearRes();
    const next = jest.fn();

    verificarToken(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  // ---- TU TURNO ----
  test.todo('responde 401 TOKEN_FALTANTE si no viene el header');
  test.todo('responde 401 FORMATO_INVALIDO si dice Basic en vez de Bearer');
  test.todo('responde 401 FORMATO_INVALIDO si viene "Bearer" sin token');
  test.todo('responde 403 TOKEN_INVALIDO si el token no coincide');
  test.todo('no llama a next cuando bloquea');
  test.todo('pone req.usuario cuando deja pasar');
});
