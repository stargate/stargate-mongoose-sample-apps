'use strict';

const mongoose = require('./mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  description: String
}, { versionKey: false });

const Product = mongoose.model('Product', productSchema);

module.exports.Product = Product;

const orderSchema = new mongoose.Schema({
  items: {
    type: String,
    get(v) {
      return v == null ? v : JSON.parse(v);
    },
    set(v) {
      if (v == null) {
        return v;
      }
      return typeof v === 'string' ? v : JSON.stringify(v);
    },
  },
  total: {
    type: Number,
    default: 0
  },
  name: {
    type: String
  },
  paymentMethod: {
    type: String,
    get(v) {
      return v == null ? v : JSON.parse(v);
    },
    set(v) {
      if (v == null) {
        return v;
      }
      return typeof v === 'string' ? v : JSON.stringify(v);
    },
  }
}, { versionKey: false });

const Order = mongoose.model('Order', orderSchema);

module.exports.Order = Order;

const cartSchema = new mongoose.Schema({
  items: {
    type: String,
    get(v) {
      return v == null ? v : JSON.parse(v);
    },
    set(v) {
      if (v == null) {
        return v;
      }
      return typeof v === 'string' ? v : JSON.stringify(v);
    },
  },
  orderId: { type: mongoose.ObjectId, ref: 'Order' },
  total: Number,
  stripeSessionId: { type: String }
}, { versionKey: false, timestamps: false, toObject: { getters: true }, toJSON: { getters: true } });

cartSchema.virtual('numItems').get(function numItems() {
  if (this.items == null) {
    return 0;
  }
  const items = typeof this.items === 'string' ? JSON.parse(this.items) : this.items;
  return items.reduce((sum, item) => sum + item.quantity, 0);
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports.Cart = Cart;

