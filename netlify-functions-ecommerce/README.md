# netlify-functions-ecommerce

This sample demonstrates using Mongoose to build an eCommerce shopping cart using [Netlify Functions](https://www.netlify.com/products/functions/), which runs on [AWS Lambda](https://mongoosejs.com/docs/lambda.html).

Other tools include:

* Stripe for payment processing
* [Mocha](https://masteringjs.io/mocha) and [Sinon](https://masteringjs.io/sinon) for testing

## Setup

Make sure you have a local stargate instance running as described on the [main page](../README.md) of this repo.

## Running This Example

1. Run `env NODE_ENV=development`
2. Run `npm install`
3. Run `npm run seed`
4. Run `npm run build` to compile the frontend
5. (Optional) set `stripeSecretKey` in `.config/development.js` to a test Stripe API key to enable Stripe checkout.
6. Run `npm start`
Run `npm run test:smoke` to run a smoke test against `http://localhost:8888` that creates a cart using [Axios](https://masteringjs.io/axios).
7. Visit `http://localhost:8888/` to see the UI

Then run `npm test`.

```sh
$ npm test

> test
> env NODE_ENV=test mocha ./test/*.test.js

Using test


  Add to Cart
    ✔ Should create a cart and add a product to the cart
    ✔ Should find the cart and add to the cart
    ✔ Should find the cart and increase the quantity of the item(s) in the cart

  Checkout
    ✔ Should do a successful checkout run

  Get the cart given an id
    ✔ Should create a cart and then find the cart.

  Products
    ✔ Should get all products.

  Remove From Cart
    ✔ Should create a cart and then it should remove the entire item from it.
    ✔ Should create a cart and then it should reduce the quantity of an item from it.


  8 passing (112ms)

```
