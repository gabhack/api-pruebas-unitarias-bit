/**
 * Este archivo es el ejemplo resuelto que se hace en clase.
 * Usalo como plantilla para escribir los demas.
 */

const {
  diasDeRetraso,
  calcularMulta,
  sumarDias,
  VALOR_DIA_RETRASO,
  TOPE_DIAS_MULTA,
} = require('../src/utils/multas');

describe('diasDeRetraso', () => {
  test('devuelve 0 cuando el libro se entrega el mismo dia del limite', () => {
    // Arrange (preparar)
    const limite = new Date('2026-09-10T00:00:00Z');
    const devolucion = new Date('2026-09-10T00:00:00Z');

    // Act (actuar)
    const resultado = diasDeRetraso(limite, devolucion);

    // Assert (afirmar)
    expect(resultado).toBe(0);
  });

  test('devuelve 0 cuando el libro se entrega antes del limite', () => {
    const limite = new Date('2026-09-10T00:00:00Z');
    const devolucion = new Date('2026-09-05T00:00:00Z');

    expect(diasDeRetraso(limite, devolucion)).toBe(0);
  });

  test('devuelve 3 cuando se entrega tres dias tarde', () => {
    const limite = new Date('2026-09-10T00:00:00Z');
    const devolucion = new Date('2026-09-13T00:00:00Z');

    expect(diasDeRetraso(limite, devolucion)).toBe(3);
  });

  test('no cuenta un dia si pasaron menos de 24 horas', () => {
    const limite = new Date('2026-09-10T00:00:00Z');
    const devolucion = new Date('2026-09-10T23:00:00Z');

    expect(diasDeRetraso(limite, devolucion)).toBe(0);
  });

  test('lanza error si no le pasan fechas', () => {
    expect(() => diasDeRetraso('2026-09-10', new Date())).toThrow(
      'FECHAS_INVALIDAS'
    );
  });
});

describe('calcularMulta', () => {
  test('no cobra nada si no hubo retraso', () => {
    expect(calcularMulta(0)).toBe(0);
  });

  test('no cobra nada con dias negativos', () => {
    expect(calcularMulta(-5)).toBe(0);
  });

  test('cobra el valor de un dia por un dia de retraso', () => {
    expect(calcularMulta(1)).toBe(VALOR_DIA_RETRASO);
  });

  test('cobra proporcional a los dias de retraso', () => {
    expect(calcularMulta(5)).toBe(5 * VALOR_DIA_RETRASO);
  });

  test('congela la multa en el tope aunque pasen mas dias', () => {
    const esperado = TOPE_DIAS_MULTA * VALOR_DIA_RETRASO;

    expect(calcularMulta(TOPE_DIAS_MULTA)).toBe(esperado);
    expect(calcularMulta(TOPE_DIAS_MULTA + 1)).toBe(esperado);
    expect(calcularMulta(500)).toBe(esperado);
  });

  test('lanza error si le pasan algo que no es numero', () => {
    expect(() => calcularMulta('tres')).toThrow('DIAS_INVALIDOS');
  });
});

describe('sumarDias', () => {
  test('suma los dias pedidos', () => {
    const inicio = new Date('2026-09-01T00:00:00Z');

    const resultado = sumarDias(inicio, 14);

    expect(resultado.toISOString()).toBe('2026-09-15T00:00:00.000Z');
  });

  test('no modifica la fecha original', () => {
    const inicio = new Date('2026-09-01T00:00:00Z');
    const copia = inicio.getTime();

    sumarDias(inicio, 14);

    expect(inicio.getTime()).toBe(copia);
  });
});
