module.exports = {
  // Estamos probando codigo de Node, no de navegador
  testEnvironment: 'node',

  // Donde estan las pruebas
  testMatch: ['**/tests/**/*.test.js'],

  // De que archivos queremos medir cobertura
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/app.js',
    '!src/rutas/**',
  ],

  // Muestra el nombre de cada prueba, no solo el resumen
  verbose: true,
};
