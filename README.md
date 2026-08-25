# API Biblioteca — práctica de pruebas unitarias

API de una biblioteca hecha en Node.js + Express. Sirve como campo de práctica para escribir pruebas unitarias con Jest.

BIT+ Full Stack · Módulo 4

---

## Arrancar

```bash
git clone https://github.com/gabhack/api-pruebas-unitarias-bit.git
cd api-pruebas-unitarias-bit
npm install
```

Levantar la API:

```bash
npm start
# API de biblioteca escuchando en http://localhost:3000
```

Correr las pruebas:

```bash
npm test              # una vez
npm run test:watch    # se queda escuchando cambios
npm run test:cobertura # con reporte de cobertura
```

---

## Qué hay adentro

```
src/
├── utils/
│   ├── multas.js            # funciones puras: días de retraso, valor de la multa
│   └── validaciones.js      # email, ISBN, cuerpo de un libro nuevo
├── repositorios/            # los datos, en memoria (no hay base de datos)
│   ├── libros.repositorio.js
│   ├── socios.repositorio.js
│   └── prestamos.repositorio.js
├── servicios/
│   └── prestamos.servicio.js  # las reglas del negocio
├── controladores/
│   ├── libros.controlador.js
│   └── prestamos.controlador.js
├── middlewares/
│   └── auth.js              # verifica el header Authorization
├── rutas/
└── app.js

tests/                       # aquí es donde trabajas
```

---

## Las reglas del negocio

Sirven para saber qué hay que probar.

**Préstamos**

- Un socio puede tener máximo **3 libros** al tiempo.
- Un socio **inactivo** no puede llevar libros.
- No se presta un libro sin **copias disponibles**.
- Si el socio tiene algún préstamo **vencido**, no puede llevar otro.
- Cada préstamo dura **14 días**.

**Multas**

- $1.000 por cada día de retraso.
- La multa se **congela a los 30 días**: aunque el libro llegue un año tarde, se cobran 30 días.
- Devolver antes o el mismo día del límite no genera multa.
- Menos de 24 horas de retraso **no cuenta** como un día.

---

## Endpoints

| Método | Ruta | Token | Qué hace |
|---|---|---|---|
| GET | `/libros` | no | Lista los libros |
| GET | `/libros/:id` | no | Un libro |
| POST | `/libros` | sí | Crea un libro |
| DELETE | `/libros/:id` | sí | Borra un libro |
| GET | `/prestamos` | no | Lista los préstamos |
| POST | `/prestamos` | sí | Presta un libro |
| PUT | `/prestamos/:id/devolucion` | sí | Registra la devolución |

El token es de mentira a propósito, para que la práctica no dependa de JWT:

```
Authorization: Bearer bit-2026
```

Ejemplo:

```bash
curl -X POST http://localhost:3000/prestamos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer bit-2026" \
  -d '{"socioId": 1, "libroId": 2}'
```

---

## Cómo se trabaja

En `tests/` hay cinco archivos. Cada uno trae **ejemplos ya resueltos** y luego una lista de `test.todo(...)`, que son las pruebas que te tocan a ti.

Un `test.todo` aparece en la consola como pendiente:

```
✎ todo  responde 404 cuando el id no existe
```

Tu trabajo es convertirlo en una prueba de verdad:

```js
test('responde 404 cuando el id no existe', () => {
  // ...
});
```

Orden sugerido:

| Archivo | Qué se practica |
|---|---|
| `tests/multas.test.js` | Ya está resuelto. Léelo primero. |
| `tests/validaciones.test.js` | `expect`, matchers, casos borde |
| `tests/prestamos.servicio.test.js` | Mocks, `beforeEach`, `toThrow` |
| `tests/libros.controlador.test.js` | Probar `(req, res)` sin servidor |
| `tests/auth.middleware.test.js` | Probar `next()` |

Las soluciones están en la rama `soluciones`:

```bash
git checkout soluciones
```

Míralas **después** de intentarlo.

---

## Licencia

MIT
