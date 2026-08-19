class InventoryPage {
  elements = {
    container: () => cy.get('.inventory_list'),
    items: () => cy.get('.inventory_item'),
    itemName: () => cy.get('[data-test="inventory-item-name"], .inventory_item_name'),
    itemPrice: () => cy.get('[data-test="inventory-item-price"], .inventory_item_price'),
    cartLink: () => cy.get('[data-test="shopping-cart-link"], .shopping_cart_link'),
    cartBadge: () => cy.get('[data-test="shopping-cart-badge"], .shopping_cart_badge'),
  };

  waitUntilLoaded() {
    this.elements.container().should('be.visible');
    this.elements.items().should('have.length.at.least', 3);
  }

  addFirstProducts(count = 3) {
    const selected = [];

    this.waitUntilLoaded();

    Cypress._.times(count, (index) => {
      this.elements.items().eq(index).within(() => {
        cy.get('[data-test="inventory-item-name"], .inventory_item_name')
          .invoke('text')
          .then((name) => {
            selected[index] = { ...(selected[index] || {}), name: name.trim() };
          });

        cy.get('[data-test="inventory-item-price"], .inventory_item_price')
          .invoke('text')
          .then((price) => {
            selected[index] = { ...(selected[index] || {}), price: price.trim() };
          });

        cy.get('button[data-test^="add-to-cart"], button.btn_inventory').click();
      });
    });

    this.elements.cartBadge().should('have.text', String(count));
    return cy.wrap(selected).should('have.length', count);
  }

  goToCart() {
    this.elements.cartLink().click();
    cy.url().should('include', '/cart.html');
  }
}

export default new InventoryPage();
