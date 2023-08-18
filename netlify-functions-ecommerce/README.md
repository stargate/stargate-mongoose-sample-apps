# netlify-functions-ecommerce

This sample demonstrates using Mongoose to build an eCommerce shopping cart using [Netlify Functions](https://www.netlify.com/products/functions/), which runs on [AWS Lambda](https://mongoosejs.com/docs/lambda.html).

Other tools include:

* Stripe for payment processing
* [Mocha](https://masteringjs.io/mocha) and [Sinon](https://masteringjs.io/sinon) for testing

## Setup

Make sure you have a local stargate instance running as described on the [main page](../README.md) of this repo.

## Running This Example 
### Setting up .env file to run against JSON API
1. Copy the `.env.example` file to `.env` and fill in the values for the environment variables.
2. Set `NODE_ENV` to `jsonapi`
3. Set `JSON_API_URL` to `http://localhost:8181/v1/ecommerce_test`
4. Set `JSON_API_AUTH_URL` to `http://localhost:8181/v1/auth`
5. Set `JSON_API_AUTH_USERNAME` to `cassandra`
6. Set `JSON_API_AUTH_PASSWORD` to `cassandra`

### Setting up .env file to run against AstraDB
1. Copy the `.env.example` file to `.env` and fill in the values for the environment variables.
2. Set `NODE_ENV` to `astra`
3. Set `ASTRA_DB_ID` to your AstraDB database ID
4. Set `ASTRA_DB_REGION` to your AstraDB database region
5. Set `ASTRA_DB_KEYSPACE` to your AstraDB keyspace
6. Set `ASTRA_DB_APPLICATION_TOKEN` to your AstraDB application token
7. Set 'ASTRA_ENVIRONMENT' to 'DEVELOPMENT' or 'TEST' or 'PRODUCTION' depending on your AstraDB environment

### running the example
1. Run `npm install`
2. Run `npm run seed`
3. Run `npm run build` to compile the frontend
4. (Optional) set `stripeSecretKey` in `.config/jsonapi.js` to a test Stripe API key to enable Stripe checkout.
5. Run `npm start`
Run `npm run test:smoke` to run a smoke test against `http://localhost:8888` that creates a cart using [Axios](https://masteringjs.io/axios).
6. Visit `http://localhost:8888/` to see the UI

Then run `npm test`.

```sh
$ npm test

> test
> mocha ./test/*.test.js

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
