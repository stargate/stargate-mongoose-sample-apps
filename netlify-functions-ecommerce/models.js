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

const paymentMethodSchema = new mongoose.Schema({
  _id: false,
  id: { type: String, required: true },
  brand: String,
  last4: String
}, { udtName: 'PaymentMethod' });

const cartItemSchema = new mongoose.Schema({
  _id: false,
  productId: { type: mongoose.ObjectId, required: true, ref: 'Product' },
  quantity: { type: Number, required: true }
}, { udtName: 'CartItem' });

let orderSchema;

if (process.env.DATA_API_TABLES) {
  orderSchema = new mongoose.Schema({
    items: [cartItemSchema],
    total: {
      type: Number,
      default: 0
    },
    name: {
      type: String
    },
    paymentMethod: paymentMethodSchema
  }, { toObject: { getters: true }, toJSON: { getters: true }, versionKey: false });
} else {
  orderSchema = new mongoose.Schema({
    items: [cartItemSchema],
    total: {
      type: Number,
      default: 0
    },
    name: {
      type: String
    },
    paymentMethod: paymentMethodSchema
  }, { optimisticConcurrency: true });
}

const Order = mongoose.model('Order', orderSchema);

module.exports.Order = Order;

let cartSchema;

if (process.env.DATA_API_TABLES) {
  cartSchema = new mongoose.Schema({
    items: [cartItemSchema],
    orderId: { type: String, ref: 'Order' },
    total: Number,
    stripeSessionId: { type: String }
  }, { timestamps: true, toObject: { getters: true }, toJSON: { getters: true }, versionKey: false });
} else {
  cartSchema = new mongoose.Schema({
    items: [cartItemSchema],
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
