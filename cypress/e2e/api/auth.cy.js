import { assertAuthToken } from '../../support/api/schemas';

describe('Fake Store API - autenticación', () => {
  it('obtiene un token con credenciales válidas y lo reutiliza', () => {
    cy.fakeStoreLogin().then((response) => {
      expect(response.status, 'POST /auth/login').to.be.oneOf([200, 201]);
      assertAuthToken(response.body);
      expect(Cypress.env('authToken')).to.eq(response.body.token);
    });

    cy.apiRequest({
      method: 'GET',
      url: '/products',
    }).then((response) => {
      expect(response.status, 'GET /products con token').to.eq(200);
      expect(response.body).to.be.an('array').and.not.be.empty;
    });
  });

  it('rechaza el login con credenciales inválidas', () => {
    cy.fixture('invalid-credentials').then((invalidUser) => {
      cy.fakeStoreLogin(invalidUser).then((response) => {
        expect(response.status, 'login negativo').to.be.within(400, 499);
        expect(response.body).to.not.have.property('token');
      });
    });
  });
});
