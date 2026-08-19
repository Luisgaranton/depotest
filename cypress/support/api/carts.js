import { assertCart } from './schemas';

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function persistableCartId(preferredId) {
  return cy.apiRequest({
    method: 'GET',
    url: '/carts',
  }).then((response) => {
    expect(response.status, 'GET /carts').to.eq(200);
    expect(response.body).to.be.an('array').and.not.be.empty;

    const exists = response.body.some((cart) => cart.id === preferredId);
    if (exists) {
      return preferredId;
    }

    return response.body[0].id;
  });
}

export function getUserIdByUsername(username) {
  return cy.apiRequest({
    method: 'GET',
    url: '/users',
  }).then((response) => {
    expect(response.status, 'GET /users').to.eq(200);
    expect(response.body).to.be.an('array').and.not.be.empty;

    const user = response.body.find((item) => item.username === username);
    expect(user, `usuario ${username} en /users`).to.exist;
    expect(user.id).to.be.a('number');
    return user.id;
  });
}

export function createCart({ userId, products, date = todayIsoDate() }) {
  return cy.apiRequest({
    method: 'POST',
    url: '/carts',
    body: { userId, date, products },
  }).then((response) => {
    expect(response.status, 'POST /carts').to.be.oneOf([200, 201]);
    assertCart(response.body);
    expect(response.body.userId).to.eq(userId);
    expect(response.body.products).to.have.length(products.length);
    return response;
  });
}

export function updateCart({ cartId, userId, products, date = todayIsoDate() }) {
  const payload = { userId, date, products };

  return persistableCartId(cartId).then((targetId) => {
    return cy.apiRequest({
      method: 'PUT',
      url: `/carts/${targetId}`,
      body: payload,
    }).then((response) => {
      expect(response.status, 'PUT /carts/:id').to.eq(200);
      assertCart(response.body);
      expect(response.body.id).to.eq(targetId);
      expect(response.body.products).to.have.length(products.length);
      return response;
    });
  });
}

export function deleteCart(cartId) {
  return persistableCartId(cartId).then((targetId) => {
    return cy.apiRequest({
      method: 'DELETE',
      url: `/carts/${targetId}`,
    }).then((response) => {
      expect(response.status, 'DELETE /carts/:id').to.eq(200);
      assertCart(response.body);
      expect(response.body.id).to.eq(targetId);
      return response;
    });
  });
}
