/**
 * Validaciones de datos que entran a la API.
 *
 * Igual que multas.js: funciones puras. Entra un dato, sale una respuesta.
 */

/**
 * Un email valido para esta biblioteca: algo@algo.algo
 *
 * @param {string} email
 * @returns {boolean}
 */
function esEmailValido(email) {
  if (typeof email !== 'string') {
    return false;
  }

  const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return patron.test(email.trim());
}

/**
 * ISBN-13: exactamente 13 digitos. Se aceptan guiones y espacios,
 * porque la gente los escribe como quiere.
 *
 * @param {string} isbn
 * @returns {boolean}
 */
function esIsbnValido(isbn) {
  if (typeof isbn !== 'string') {
    return false;
  }

  const soloDigitos = isbn.replace(/[\s-]/g, '');
  return /^\d{13}$/.test(soloDigitos);
}

/**
 * Revisa el cuerpo que llega en un POST /libros.
 *
 * Devuelve SIEMPRE un objeto con la misma forma, para que quien la use
 * no tenga que adivinar. Esto se llama "contrato" y hace la funcion
 * mucho mas facil de probar.
 *
 * @param {object} datos
 * @returns {{ valido: boolean, errores: string[] }}
 */
function validarLibroNuevo(datos) {
  const errores = [];

  if (!datos || typeof datos !== 'object') {
    return { valido: false, errores: ['CUERPO_VACIO'] };
  }

  const { titulo, autor, isbn, copiasTotales } = datos;

  if (typeof titulo !== 'string' || titulo.trim().length < 2) {
    errores.push('TITULO_INVALIDO');
  }

  if (typeof autor !== 'string' || autor.trim().length < 2) {
    errores.push('AUTOR_INVALIDO');
  }

  if (!esIsbnValido(isbn)) {
    errores.push('ISBN_INVALIDO');
  }

  if (!Number.isInteger(copiasTotales) || copiasTotales < 1) {
    errores.push('COPIAS_INVALIDAS');
  }

  return {
    valido: errores.length === 0,
    errores,
  };
}

module.exports = {
  esEmailValido,
  esIsbnValido,
  validarLibroNuevo,
};
