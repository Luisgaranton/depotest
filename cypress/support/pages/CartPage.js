class CartPage {
  elements = {
    title: () => cy.get('[data-test="title"], .title'),
    items: () => cy.get('.cart_item'),
    checkout: () => cy.get('[data-test="checkout"]'),
  };

  waitUntilLoaded() {
    this.elements.title().should('have.text', 'Your Cart');
  }

  assertSelectedProducts(selectedProducts) {
    this.waitUntilLoaded();
    this.elements.items().should('have.length', selectedProducts.length).each(($row, index) => {
      const expected = selectedProducts[index];

      cy.wrap($row).within(() => {
        cy.get('[data-test="inventory-item-name"], .inventory_item_name').should('have.text', expected.name);
        cy.get('[data-test="inventory-item-price"], .inventory_item_price').should('have.text', expected.price);
        cy.get('[data-test="item-quantity"], .cart_quantity').should('have.text', '1');
      });
    });
  }

  startCheckout() {
    this.elements.checkout().click();
    cy.url().should('include', 'checkout-step-one');
  }
}

export default new CartPage();
