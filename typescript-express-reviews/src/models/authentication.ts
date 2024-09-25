import mongoose from './mongoose';

const schema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['password', 'one time'],
    default: 'password'
  },
  user_id: { type: mongoose.Types.ObjectId, required: true },
  secret: { type: String, required: true }
}, { versionKey: false });

const Authentication = mongoose.model('Authentication', schema);

export default Authentication;

