import { getProducts, pickCatalogProducts } from '../../support/api/products';
import { createCart, deleteCart, getUserIdByUsername, updateCart } from '../../support/api/carts';

describe('Fake Store API - ciclo de vida del carrito', () => {
  const catalog = {};

  before(() => {
    cy.fakeStoreLogin().then((response) => {
      expect(response.status, 'login previo al flujo de carrito').to.be.oneOf([200, 201]);
      expect(Cypress.env('authToken')).to.be.a('string').and.not.be.empty;
    });

    getUserIdByUsername(Cypress.env('FAKESTORE_USERNAME')).then((userId) => {
      catalog.userId = userId;
    });

    getProducts().then((products) => {
      const picked = pickCatalogProducts(products, 3);
      catalog.selected = picked.selected;
      catalog.extra = picked.extra;
      catalog.cartItems = picked.cartItems;
    });
  });

  it('crea un carrito con 3 productos obtenidos dinámicamente', () => {
    expect(catalog.cartItems, 'productos del carrito').to.have.length(3);

    createCart({
      userId: catalog.userId,
      products: catalog.cartItems,
    }).then((response) => {
      catalog.cartId = response.body.id;
      Cypress.env('cartId', response.body.id);

      const returnedIds = response.body.products.map((item) => item.productId);
      catalog.cartItems.forEach((item) => {
        expect(returnedIds).to.include(item.productId);
      });
    });
  });

  it('actualiza el carrito creado agregando un producto extra', () => {
    expect(catalog.cartId, 'id de carrito creado').to.be.a('number');

    const updatedProducts = [
      ...catalog.cartItems,
      { productId: catalog.extra.id, quantity: 1 },
    ];

    updateCart({
      cartId: catalog.cartId,
      userId: catalog.userId,
      products: updatedProducts,
    }).then((response) => {
      catalog.cartId = response.body.id;

      const returnedIds = response.body.products.map((item) => item.productId);

      expect(response.body.products).to.have.length(4);
      expect(returnedIds).to.include(catalog.extra.id);
      catalog.cartItems.forEach((item) => {
        expect(returnedIds).to.include(item.productId);
      });
    });
  });

  it('elimina el carrito creado', () => {
    expect(catalog.cartId, 'id de carrito a eliminar').to.be.a('number');

    deleteCart(catalog.cartId).then((response) => {
      expect(response.body.id).to.eq(catalog.cartId);
    });
  });
});
