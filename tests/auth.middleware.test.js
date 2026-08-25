/**
 * SOLUCION - Actividad 7
 */

const { verificarToken, TOKEN_VALIDO } = require('../src/middlewares/auth');

function crearRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('verificarToken', () => {
  test('deja pasar cuando el token es correcto', () => {
    const req = { headers: { authorization: `Bearer ${TOKEN_VALIDO}` } };
    const res = crearRes();
    const next = jest.fn();

    verificarToken(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('responde 401 TOKEN_FALTANTE si no viene el header', () => {
    const req = { headers: {} };
    const res = crearRes();
    const next = jest.fn();

    verificarToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'TOKEN_FALTANTE' });
  });

  test('responde 401 FORMATO_INVALIDO si dice Basic en vez de Bearer', () => {
    const req = { headers: { authorization: `Basic ${TOKEN_VALIDO}` } };
    const res = crearRes();
    const next = jest.fn();

    verificarToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'FORMATO_INVALIDO' });
  });

  test('responde 401 FORMATO_INVALIDO si viene "Bearer" sin token', () => {
    const req = { headers: { authorization: 'Bearer' } };
    const res = crearRes();
    const next = jest.fn();

    verificarToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'FORMATO_INVALIDO' });
  });

  test('responde 403 TOKEN_INVALIDO si el token no coincide', () => {
    const req = { headers: { authorization: 'Bearer token-de-mentiras' } };
    const res = crearRes();
    const next = jest.fn();

    verificarToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'TOKEN_INVALIDO' });
  });

  test('no llama a next cuando bloquea', () => {
    const req = { headers: {} };
    const res = crearRes();
    const next = jest.fn();

    verificarToken(req, res, next);

    expect(next).not.toHaveBeenCalled();
  });

  test('pone req.usuario cuando deja pasar', () => {
    const req = { headers: { authorization: `Bearer ${TOKEN_VALIDO}` } };
    const res = crearRes();
    const next = jest.fn();

    verificarToken(req, res, next);

    expect(req.usuario).toEqual({ rol: 'bibliotecario' });
  });
});
