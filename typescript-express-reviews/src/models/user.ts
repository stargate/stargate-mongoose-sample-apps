import mongoose from './mongoose';

const schema = new mongoose.Schema({
  id: {
    type: mongoose.Types.ObjectId,
    required: true,
    default: () => new mongoose.Types.ObjectId()
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  }
}, { _id: false, versionKey: false });

schema.virtual('displayName').get(function() {
  return this.first_name + ' ' + this.last_name.slice(0, 1) + '.';
});

const User = mongoose.model('User', schema);

export default User;
