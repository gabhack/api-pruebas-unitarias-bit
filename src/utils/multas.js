/**
 * Reglas de multas de la biblioteca.
 *
 * Estas son funciones puras: reciben datos, devuelven datos.
 * No leen la base de datos, no escriben archivos, no dependen de la hora actual.
 * Por eso son las mas faciles de probar.
 */

// Cuanto se cobra por cada dia de retraso, en pesos
const VALOR_DIA_RETRASO = 1000;

// Aunque el libro llegue dos anios tarde, la multa se congela a los 30 dias
const TOPE_DIAS_MULTA = 30;

// Un dia en milisegundos: 24 horas * 60 minutos * 60 segundos * 1000 ms
const MS_POR_DIA = 24 * 60 * 60 * 1000;

/**
 * Cuantos dias de retraso lleva una devolucion.
 *
 * @param {Date} fechaLimite - hasta cuando podia tener el libro
 * @param {Date} fechaDevolucion - cuando lo trajo de verdad
 * @returns {number} dias de retraso, nunca negativo
 */
function diasDeRetraso(fechaLimite, fechaDevolucion) {
  if (!(fechaLimite instanceof Date) || !(fechaDevolucion instanceof Date)) {
    throw new Error('FECHAS_INVALIDAS');
  }

  const diferenciaMs = fechaDevolucion.getTime() - fechaLimite.getTime();

  // Si devolvio antes o el mismo dia, no hay retraso
  if (diferenciaMs <= 0) {
    return 0;
  }

  return Math.floor(diferenciaMs / MS_POR_DIA);
}

/**
 * Cuanto debe pagar segun los dias de retraso.
 *
 * @param {number} dias
 * @returns {number} valor de la multa en pesos
 */
function calcularMulta(dias) {
  if (typeof dias !== 'number' || Number.isNaN(dias)) {
    throw new Error('DIAS_INVALIDOS');
  }

  if (dias <= 0) {
    return 0;
  }

  const diasCobrados = Math.min(dias, TOPE_DIAS_MULTA);
  return diasCobrados * VALOR_DIA_RETRASO;
}

/**
 * Suma dias a una fecha sin modificar la original.
 *
 * @param {Date} fecha
 * @param {number} dias
 * @returns {Date} una fecha nueva
 */
function sumarDias(fecha, dias) {
  if (!(fecha instanceof Date)) {
    throw new Error('FECHA_INVALIDA');
  }

  return new Date(fecha.getTime() + dias * MS_POR_DIA);
}

module.exports = {
  VALOR_DIA_RETRASO,
  TOPE_DIAS_MULTA,
  diasDeRetraso,
  calcularMulta,
  sumarDias,
};
