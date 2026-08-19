import inventoryPage from '../../support/pages/InventoryPage';
import cartPage from '../../support/pages/CartPage';
import checkoutPage from '../../support/pages/CheckoutPage';
import checkoutCompletePage from '../../support/pages/CheckoutCompletePage';

describe('Sauce Demo - flujo de compra', () => {
  beforeEach(() => {
    cy.loginSauceDemo();
  });

  it('completa una compra de 3 productos y valida el carrito y la confirmación', () => {
    inventoryPage.addFirstProducts(3).then((selectedProducts) => {
      inventoryPage.goToCart();
      cartPage.assertSelectedProducts(selectedProducts);
      cartPage.startCheckout();

      cy.fixture('checkout-customer').then((customer) => {
        checkoutPage.fillCustomerInfo(customer);
      });

      checkoutPage.assertOverview(selectedProducts);
      checkoutPage.finish();
      checkoutCompletePage.assertOrderConfirmed();
    });
  });
});
