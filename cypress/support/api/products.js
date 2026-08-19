import { assertProduct } from './schemas';

export function getProducts() {
  return cy.apiRequest({
    method: 'GET',
    url: '/products',
  }).then((response) => {
    expect(response.status, 'GET /products').to.eq(200);
    expect(response.body).to.be.an('array').and.have.length.greaterThan(3);
    response.body.forEach(assertProduct);
    return response.body;
  });
}

export function pickCatalogProducts(products, count = 3) {
  expect(products.length, 'productos disponibles en catálogo').to.be.at.least(count + 1);

  const selected = products.slice(0, count);
  const extra = products[count];

  return {
    selected,
    extra,
    cartItems: selected.map((product, index) => ({
      productId: product.id,
      quantity: index + 1,
    })),
  };
}
