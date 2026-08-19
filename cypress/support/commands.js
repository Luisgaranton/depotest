import { assertAuthToken } from './api/schemas';
import loginPage from './pages/LoginPage';

const apiUrl = () => Cypress.env('apiUrl');

function authHeaders() {
  const token = Cypress.env('authToken');

  if (!token) {
    return {};
  }

  return { Authorization: `Bearer ${token}` };
}

Cypress.Commands.add('apiRequest', (options = {}) => {
  return cy.request({
    failOnStatusCode: false,
    ...options,
    url: options.url.startsWith('http') ? options.url : `${apiUrl()}${options.url}`,
    headers: {
      ...authHeaders(),
      ...options.headers,
    },
  });
});

Cypress.Commands.add('fakeStoreLogin', ({ username, password } = {}) => {
  const user = username ?? Cypress.env('FAKESTORE_USERNAME');
  const pass = password ?? Cypress.env('FAKESTORE_PASSWORD');

  expect(user, 'FAKESTORE_USERNAME debe estar definida').to.be.a('string').and.not.be.empty;
  expect(pass, 'FAKESTORE_PASSWORD debe estar definida').to.be.a('string').and.not.be.empty;

  return cy
    .request({
      method: 'POST',
      url: `${apiUrl()}/auth/login`,
      failOnStatusCode: false,
      body: {
        username: user,
        password: pass,
      },
    })
    .then((response) => {
      if ([200, 201].includes(response.status) && response.body?.token) {
        assertAuthToken(response.body);
        Cypress.env('authToken', response.body.token);
      }

      return response;
    });
});

Cypress.Commands.add('loginSauceDemo', () => {
  const username = Cypress.env('SAUCE_USERNAME');
  const password = Cypress.env('SAUCE_PASSWORD');

  expect(username, 'SAUCE_USERNAME debe estar definida').to.be.a('string').and.not.be.empty;
  expect(password, 'SAUCE_PASSWORD debe estar definida').to.be.a('string').and.not.be.empty;

  cy.visit('/', {
    onBeforeLoad(win) {
      win.sessionStorage.setItem('session-username', username);
    },
  });

  cy.get('[data-test="login-button"], .inventory_list').first().then(($el) => {
    if ($el.attr('data-test') === 'login-button') {
      loginPage.submitCredentials(username, password);
    }
  });

  cy.get('.inventory_list').should('be.visible');
});
