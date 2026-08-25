/**
 * ACTIVIDAD 1 y 2
 *
 * Los `test.todo` son pruebas pendientes: Jest las muestra en la lista
 * pero no las ejecuta. Tu trabajo es convertir cada `test.todo('...')`
 * en un `test('...', () => { ... })` de verdad.
 *
 * Corre `npm test` y mira como van apareciendo.
 */

const {
  esEmailValido,
  esIsbnValido,
  validarLibroNuevo,
} = require('../src/utils/validaciones');

describe('esEmailValido', () => {
  test.todo('acepta un email normal como ana@bit.co');
  test.todo('rechaza un texto sin arroba');
  test.todo('rechaza un email sin punto en el dominio');
  test.todo('rechaza cuando no le pasan un string');
  test.todo('acepta un email con espacios alrededor');
});

describe('esIsbnValido', () => {
  test.todo('acepta 13 digitos seguidos');
  test.todo('acepta un ISBN con guiones');
  test.todo('rechaza uno de 10 digitos');
  test.todo('rechaza uno que trae letras');
  test.todo('rechaza cuando no le pasan un string');
});

describe('validarLibroNuevo', () => {
  test.todo('devuelve valido en true cuando todos los datos estan bien');
  test.todo('devuelve un arreglo de errores vacio cuando todo esta bien');
  test.todo('reporta TITULO_INVALIDO si el titulo tiene una sola letra');
  test.todo('reporta COPIAS_INVALIDAS si copiasTotales es 0');
  test.todo('reporta COPIAS_INVALIDAS si copiasTotales es 2.5');
  test.todo('acumula varios errores a la vez');
  test.todo('devuelve CUERPO_VACIO si no le pasan nada');
});
