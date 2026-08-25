const app = require('./src/app');

const PUERTO = process.env.PORT || 3000;

app.listen(PUERTO, () => {
  console.log(`API de biblioteca escuchando en http://localhost:${PUERTO}`);
});
