class CheckoutCompletePage {
  elements = {
    header: () => cy.get('[data-test="complete-header"]'),
    message: () => cy.get('[data-test="complete-text"]'),
    backHome: () => cy.get('[data-test="back-to-products"]'),
  };

  assertOrderConfirmed() {
    this.elements.header()
      .should('be.visible')
      .and('contain.text', 'Thank you for your order!');
    this.elements.message()
      .should('be.visible')
      .and(
        'have.text',
        'Your order has been dispatched, and will arrive just as fast as the pony can get there!',
      );
    this.elements.backHome().should('be.visible');
  }
}

export default new CheckoutCompletePage();
