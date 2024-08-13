'use strict';

require('../../config');

const { Cart, Product } = require('../../models');
const connect = require('../../connect');

const handler = async(event) => {
  try {
    event.body = JSON.parse(event.body || {});
    await connect();
    const products = await Product.find();
    if (event.body.cartId) {
      // get the document containing the specified cartId
      const cart = await Cart.
        findOne({ id: event.body.cartId }).
        setOptions({ sanitizeFilter: true });

      if (cart == null) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: 'Cart not found' })
        };
      }
      if (!Array.isArray(event.body.items)) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'items is not an array' })
        };
      }
      for (const product of event.body.items) {
        const exists = cart.items?.find(item => item?.productId?.toString() === product?.productId?.toString());
        if (!exists) {
          if (products.find(p => product?.productId?.toString() === p?.id?.toString())) {
            cart.items = [...(cart.items || []), product];
          }
        } else {
          cart.items = [
            ...cart.items.filter(item => item?.productId?.toString() !== product?.productId?.toString()),
            { productId: product.productId, quantity: exists.quantity + product.quantity }
          ];
        }
      }

      if (!cart.items.length) {
        return { statusCode: 200, body: JSON.stringify({ cart: null }) };
      }

      await Cart.updateOne({ id: cart.id }, cart.getChanges());
      return { statusCode: 200, body: JSON.stringify(cart) };
    } else {
      // If no cartId, create a new cart
      const [cart] = await Cart.insertMany([{ items: event.body.items }]);
      return { statusCode: 200, body: JSON.stringify(cart) };
    }
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
