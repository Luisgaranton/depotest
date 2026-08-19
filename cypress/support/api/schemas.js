export function assertAuthToken(body) {
  expect(body, 'cuerpo de login').to.be.an('object');
  expect(body).to.have.property('token');
  expect(body.token).to.be.a('string').and.not.be.empty;
  expect(body.token, 'token JWT').to.match(
    /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/,
  );
}

export function assertProduct(product) {
  expect(product).to.be.an('object');
  expect(product).to.include.all.keys(
    'id',
    'title',
    'price',
    'description',
    'category',
    'image',
    'rating',
  );
  expect(product.id).to.be.a('number');
  expect(product.title).to.be.a('string').and.not.be.empty;
  expect(product.price).to.be.a('number');
  expect(product.description).to.be.a('string');
  expect(product.category).to.be.a('string');
  expect(product.image).to.be.a('string');
  expect(product.rating).to.be.an('object');
  expect(product.rating.rate).to.be.a('number');
  expect(product.rating.count).to.be.a('number');
}

export function assertCartProduct(item) {
  expect(item).to.be.an('object');
  expect(item).to.include.all.keys('productId', 'quantity');
  expect(item.productId).to.be.a('number');
  expect(item.quantity).to.be.a('number').and.to.be.greaterThan(0);
}

export function assertCart(cart) {
  expect(cart).to.be.an('object');
  expect(cart).to.include.keys('id', 'userId', 'date', 'products');
  expect(cart.id).to.be.a('number');
  expect(cart.userId).to.be.a('number');
  expect(cart.date).to.be.a('string').and.not.be.empty;
  expect(cart.products).to.be.an('array');
  cart.products.forEach(assertCartProduct);
}
