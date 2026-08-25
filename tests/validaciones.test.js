/**
 * SOLUCION - Actividades 1 y 2
 */

const {
  esEmailValido,
  esIsbnValido,
  validarLibroNuevo,
} = require('../src/utils/validaciones');

describe('esEmailValido', () => {
  test('acepta un email normal como ana@bit.co', () => {
    expect(esEmailValido('ana@bit.co')).toBe(true);
  });

  test('rechaza un texto sin arroba', () => {
    expect(esEmailValido('anabit.co')).toBe(false);
  });

  test('rechaza un email sin punto en el dominio', () => {
    expect(esEmailValido('ana@bit')).toBe(false);
  });

  test('rechaza cuando no le pasan un string', () => {
    expect(esEmailValido(null)).toBe(false);
    expect(esEmailValido(undefined)).toBe(false);
    expect(esEmailValido(42)).toBe(false);
    expect(esEmailValido({})).toBe(false);
  });

  test('acepta un email con espacios alrededor', () => {
    expect(esEmailValido('  ana@bit.co  ')).toBe(true);
  });
});

describe('esIsbnValido', () => {
  test('acepta 13 digitos seguidos', () => {
    expect(esIsbnValido('9780307474728')).toBe(true);
  });

  test('acepta un ISBN con guiones', () => {
    expect(esIsbnValido('978-0-307-47472-8')).toBe(true);
  });

  test('rechaza uno de 10 digitos', () => {
    expect(esIsbnValido('0307474720')).toBe(false);
  });

  test('rechaza uno que trae letras', () => {
    expect(esIsbnValido('978030747472X')).toBe(false);
  });

  test('rechaza cuando no le pasan un string', () => {
    expect(esIsbnValido(9780307474728)).toBe(false);
    expect(esIsbnValido(null)).toBe(false);
  });
});

describe('validarLibroNuevo', () => {
  // Un libro correcto que reutilizamos en varias pruebas
  const libroOk = {
    titulo: 'Rayuela',
    autor: 'Julio Cortazar',
    isbn: '9788437604572',
    copiasTotales: 2,
  };

  test('devuelve valido en true cuando todos los datos estan bien', () => {
    expect(validarLibroNuevo(libroOk).valido).toBe(true);
  });

  test('devuelve un arreglo de errores vacio cuando todo esta bien', () => {
    expect(validarLibroNuevo(libroOk).errores).toEqual([]);
  });

  test('reporta TITULO_INVALIDO si el titulo tiene una sola letra', () => {
    const resultado = validarLibroNuevo({ ...libroOk, titulo: 'R' });

    expect(resultado.valido).toBe(false);
    expect(resultado.errores).toContain('TITULO_INVALIDO');
  });

  test('reporta COPIAS_INVALIDAS si copiasTotales es 0', () => {
    const resultado = validarLibroNuevo({ ...libroOk, copiasTotales: 0 });

    expect(resultado.errores).toContain('COPIAS_INVALIDAS');
  });

  test('reporta COPIAS_INVALIDAS si copiasTotales es 2.5', () => {
    const resultado = validarLibroNuevo({ ...libroOk, copiasTotales: 2.5 });

    expect(resultado.errores).toContain('COPIAS_INVALIDAS');
  });

  test('acumula varios errores a la vez', () => {
    const resultado = validarLibroNuevo({
      titulo: '',
      autor: '',
      isbn: 'abc',
      copiasTotales: -1,
    });

    expect(resultado.valido).toBe(false);
    expect(resultado.errores).toHaveLength(4);
    expect(resultado.errores).toEqual([
      'TITULO_INVALIDO',
      'AUTOR_INVALIDO',
      'ISBN_INVALIDO',
      'COPIAS_INVALIDAS',
    ]);
  });

  test('devuelve CUERPO_VACIO si no le pasan nada', () => {
    expect(validarLibroNuevo(undefined)).toEqual({
      valido: false,
      errores: ['CUERPO_VACIO'],
    });
  });
});
