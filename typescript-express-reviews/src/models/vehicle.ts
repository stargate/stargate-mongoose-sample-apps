import mongoose from './mongoose';

const schema = new mongoose.Schema({
  id: {
    type: mongoose.Types.ObjectId,
    required: true,
    default: () => new mongoose.Types.ObjectId()
  },
  make: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true,
    validate: (v: number) => Number.isInteger(v) && v >= 1950
  },
  images: {
    type: String,
    get(v?: string | null) {
      return v == null ? v : JSON.parse(v);
    },
    set(v: unknown) {
      if (v == null) {
        return v;
      }
      return typeof v === 'string' ? v : JSON.stringify(v);
    },
  },
  numReviews: {
    type: Number,
    required: true,
    default: 0
  },
  averageReview: {
    type: Number,
    required: true,
    default: 0
  }
}, { _id: false, versionKey: false });

const Vehicle = mongoose.model('Vehicle', schema);

export default Vehicle;
