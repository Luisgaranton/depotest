class CheckoutPage {
  elements = {
    firstName: () => cy.get('[data-test="firstName"]'),
    lastName: () => cy.get('[data-test="lastName"]'),
    postalCode: () => cy.get('[data-test="postalCode"]'),
    continue: () => cy.get('[data-test="continue"]'),
    finish: () => cy.get('[data-test="finish"]'),
    summaryItems: () => cy.get('.cart_item'),
    itemName: () => cy.get('[data-test="inventory-item-name"]'),
    itemPrice: () => cy.get('[data-test="inventory-item-price"]'),
    subtotal: () => cy.get('[data-test="subtotal-label"]'),
    tax: () => cy.get('[data-test="tax-label"]'),
    total: () => cy.get('[data-test="total-label"]'),
  };

  fillCustomerInfo({ firstName, lastName, postalCode }) {
    this.elements.firstName().type(firstName);
    this.elements.lastName().type(lastName);
    this.elements.postalCode().type(postalCode);
    this.elements.continue().click();
    cy.url().should('include', 'checkout-step-two');
  }

  assertOverview(selectedProducts) {
    this.elements.summaryItems().should('have.length', selectedProducts.length);

    selectedProducts.forEach((product) => {
      cy.contains('[data-test="inventory-item-name"], .inventory_item_name', product.name)
        .parents('.cart_item')
        .find('[data-test="inventory-item-price"], .inventory_item_price')
        .should('have.text', product.price);
    });

    const expectedSubtotal = selectedProducts.reduce((sum, product) => {
      return sum + Number(product.price.replace('$', ''));
    }, 0);

    this.elements.subtotal().should('contain', expectedSubtotal.toFixed(2));
    this.elements.tax().invoke('text').should('match', /Tax: \$\d+\.\d{2}/);
    this.elements.total().invoke('text').should('match', /Total: \$\d+\.\d{2}/);
  }

  finish() {
    this.elements.finish().click();
    cy.url().should('include', 'checkout-complete');
  }
}

export default new CheckoutPage();
