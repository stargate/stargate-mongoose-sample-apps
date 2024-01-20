'use strict';

require('../../config');

const stripe = require('../../integrations/stripe');
const { Cart, Product } = require('../../models');
const connect = require('../../connect');

const handler = async(event) => {
  try {
    event.body = JSON.parse(event.body || {});
    await connect();
    const cart = await Cart.
      findOne({ _id: event.body.cartId }).
      setOptions({ sanitizeFilter: true }).
      orFail();

    const stripeProducts = { line_items: [] };
    let total = 0;
    for (let i = 0; i < cart.items.length; i++) {
      const product = await Product.findOne({ _id: cart.items[i].productId });
      stripeProducts.line_items.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name
          },
          unit_amount: product.price * 100
        },
        quantity: cart.items[i].quantity
      });
      total = total + (product.price * cart.items[i].quantity);
    }

    cart.total = total;

    if (process.env.STRIPE_SECRET_KEY === 'test') {
      await cart.save();
      return {
        statusCode: 200,
        body: JSON.stringify({ cart: cart, url: '/order-confirmation' })
      };
    }

    const session = await stripe.checkout.sessions.create({
      line_items: stripeProducts.line_items,
      mode: 'payment',
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL
    });

    cart.stripeSessionId = session.id;
    await cart.save();

    return {
      statusCode: 200,
      body: JSON.stringify({ cart: cart, url: session.url })
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
