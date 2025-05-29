'use strict';

const mongoose = require('./mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  description: String
});

const Product = mongoose.model('Product', productSchema);

module.exports.Product = Product;

let orderSchema;

if (process.env.DATA_API_TABLES) {
  orderSchema = new mongoose.Schema({
    items: [{
      // Tables don't support lists of objects, so store as JSON strings
      type: String,
      get(v) {
        return v == null ? v : JSON.parse(v);
      },
      set(v) {
        if (v == null) {
          return v;
        }
        return typeof v === 'string' ? v : JSON.stringify(v);
      }
    }],
    total: {
      type: Number,
      default: 0
    },
    name: {
      type: String
    },
    paymentMethod: {
      id: String,
      brand: String,
      last4: String
    }
  }, { optimisticConcurrency: true, toObject: { getters: true }, toJSON: { getters: true } });
} else {
  orderSchema = new mongoose.Schema({
    items: [{
      _id: false,
      productId: { type: mongoose.ObjectId, required: true, ref: 'Product' },
      quantity: { type: Number, required: true, validate: v => v > 0 }
    }],
    total: {
      type: Number,
      default: 0
    },
    name: {
      type: String
    },
    paymentMethod: {
      id: String,
      brand: String,
      last4: String
    }
  }, { optimisticConcurrency: true });
}

const Order = mongoose.model('Order', orderSchema);

module.exports.Order = Order;

let cartSchema;

if (process.env.DATA_API_TABLES) {
  cartSchema = new mongoose.Schema({
    items: [{
      // Tables don't support lists of objects, so store as JSON strings
      type: String,
      get(v) {
        return v == null ? v : JSON.parse(v);
      },
      set(v) {
        if (v == null) {
          return v;
        }
        return typeof v === 'string' ? v : JSON.stringify(v);
      }
    }],
    orderId: { type: String, ref: 'Order' },
    total: Number,
    stripeSessionId: { type: String }
  }, { timestamps: true, toObject: { getters: true }, toJSON: { getters: true } });
} else {
  cartSchema = new mongoose.Schema({
    items: [{
      _id: false,
      productId: { type: mongoose.ObjectId, required: true, ref: 'Product' },
      quantity: { type: Number, required: true }
    }],
    orderId: { type: mongoose.ObjectId, ref: 'Order' },
    total: Number,
    stripeSessionId: { type: String }
  }, { timestamps: true });
}

cartSchema.virtual('numItems').get(function numItems() {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports.Cart = Cart;
