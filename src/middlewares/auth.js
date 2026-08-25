/**
 * Middleware de autenticacion.
 *
 * Es a proposito mas simple que un JWT de verdad: aca lo que interesa
 * es que sea una funcion (req, res, next) para practicar como se prueba
 * un middleware, incluyendo el famoso next().
 */

const TOKEN_VALIDO = 'bit-2026';

function verificarToken(req, res, next) {
  const cabecera = req.headers?.authorization;

  if (!cabecera) {
    return res.status(401).json({ error: 'TOKEN_FALTANTE' });
  }

  const [tipo, token] = cabecera.split(' ');

  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'FORMATO_INVALIDO' });
  }

  if (token !== TOKEN_VALIDO) {
    return res.status(403).json({ error: 'TOKEN_INVALIDO' });
  }

  req.usuario = { rol: 'bibliotecario' };
  return next();
}

module.exports = {
  verificarToken,
  TOKEN_VALIDO,
};
