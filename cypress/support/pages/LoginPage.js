class LoginPage {
  elements = {
    username: () => cy.get('[data-test="username"]'),
    password: () => cy.get('[data-test="password"]'),
    submit: () => cy.get('[data-test="login-button"]'),
  };

  submitCredentials(username, password) {
    this.elements.username().type(username);
    this.elements.password().type(password, { log: false });
    this.elements.submit().click();
  }
}

export default new LoginPage();
