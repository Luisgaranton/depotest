# Challenge técnico QA — DCAC

Este repo es la entrega del challenge de Analista QA. Hay tres partes:

1. Tests de API con Cypress contra [Fake Store](https://fakestoreapi.com/)
2. Un flujo E2E de compra en [Sauce Demo](https://www.saucedemo.com/)
3. Un reporte de defectos en PDF, a partir de la tabla de movimientos de una billetera virtual

Si nunca usaste Cypress, no te preocupes: abajo está el camino completo, desde instalar Node hasta abrir el PDF.

---

## Qué necesitás tener instalado

- **Node.js 18 o más nuevo** (viene con `npm`). Si no lo tenés: [nodejs.org](https://nodejs.org/)
- **Git**, si vas a clonar el repo
- **Chrome**, para el runner visual y para GitHub Actions

Para chequear Node:

```powershell
node -v
npm -v
```

---

## 1. Bajar el proyecto e instalarlo

Si lo clonás desde GitHub:

```powershell
git clone https://github.com/TU-USUARIO/depotest.git
cd depotest
```

Si ya estás en la carpeta del proyecto, saltá el clone.

Instalá las dependencias (la primera vez tarda un poco porque descarga Cypress):

```powershell
npm install
```

Si Cypress te dice que no encuentra el ejecutable:

```powershell
npx cypress install
```

---

## 2. Armar las credenciales (una sola vez)

Los tests **no** tienen usuario, password ni token escritos adentro. Eso vive en un archivo local que no se sube a GitHub.

Copiá el ejemplo:

```powershell
copy cypress.env.example.json cypress.env.json
```

En Mac o Linux:

```bash
cp cypress.env.example.json cypress.env.json
```

El archivo ya trae las cuentas públicas de las demos:

| Variable | Para qué | Valor de ejemplo |
| --- | --- | --- |
| `FAKESTORE_USERNAME` | Login de Fake Store | `mor_2314` |
| `FAKESTORE_PASSWORD` | Password de Fake Store | `83r5^_` |
| `SAUCE_USERNAME` | Usuario de Sauce Demo | `standard_user` |
| `SAUCE_PASSWORD` | Password de Sauce Demo | `secret_sauce` |

El token de Fake Store no se guarda en ningún archivo. El test hace login, lo obtiene y lo reusa en los requests que siguen.

---

## 3. Correr los tests

Toda la suite (lo que pide el challenge):

```powershell
npm test
```

Deberías ver 6 tests en verde: 2 de login API, 3 del carrito y 1 del checkout en Sauce Demo.

Solo API:

```powershell
npm run test:api
```

Solo la compra en la web:

```powershell
npm run test:ui
```

Si querés **ver** el navegador mientras corre, sin abrir la app de Cypress:

```powershell
npm run test:headed
```

---

## 4. Abrir Cypress (opcional)

Esto abre el runner para elegir un spec y verlo paso a paso:

```powershell
npm run cy:open
```

La primera vez puede tardar en verificar el binario. Elegí E2E Testing → Chrome, y después el archivo que quieras (`auth.cy.js`, `carts.cy.js` o `checkout.cy.js`).

Si se abre una ventana blanca, cerrala y usá `npm test` o `npm run test:headed`. Es un problema conocido de Electron en Windows, no de estos tests.

---

## 5. Abrir el reporte de defectos

El punto 3 del challenge está en un PDF:

`docs/reporte-defectos.pdf`

Formas de abrirlo:

- Doble clic en el archivo, desde el Explorador
- Desde la carpeta del proyecto:

```powershell
npm run report:open
```

O:

```powershell
explorer docs\reporte-defectos.pdf
```

Ahí están los defectos de la tabla de movimientos, los campos que conviene usar al reportar un bug, y el reporte formal de uno de ellos (BUG-001).

---

## Qué cubre cada parte

**API (Fake Store)**  
Login válido, login inválido, crear un carrito con 3 productos sacados de `GET /products` (no hay IDs fijos), actualizarlo agregando un producto más, y borrarlo. En cada request se valida status HTTP, estructura y tipos.

**UI (Sauce Demo)**  
El login queda afuera del caso: el test arranca ya dentro del catálogo. Elige 3 productos, valida nombre/precio/cantidad en el carrito, completa el checkout y chequea el mensaje de confirmación.

**Reporte**  
Análisis de la consulta de movimientos de la billetera y un bug report completo.

---

## GitHub Actions

Cada push o pull request corre `npm test` en Ubuntu + Chrome. El archivo está en `.github/workflows/cypress.yml`.

En GitHub: pestaña **Actions** → workflow **Cypress**. Si algo de UI falla, bajá el artifact `cypress-screenshots`.

Las credenciales en CI van con el prefijo `CYPRESS_`. No se usa `cypress.env.json`. Si no cargás secrets, el workflow usa las cuentas públicas de las demos. Si querés secrets: **Settings → Secrets and variables → Actions** (`FAKESTORE_USERNAME`, `FAKESTORE_PASSWORD`, `SAUCE_USERNAME`, `SAUCE_PASSWORD`).

---

## Cómo está organizado

```text
cypress/e2e/api/          tests de Fake Store
cypress/e2e/ui/           test de compra en Sauce Demo
cypress/fixtures/         datos de checkout y del login inválido
cypress/support/api/      helpers y validación de esquemas
cypress/support/pages/    Page Objects de la web
docs/reporte-defectos.pdf el reporte de bugs (abrilo con npm run report:open)
```

`cypress.env.json` y `node_modules` no se suben (están en `.gitignore`).
