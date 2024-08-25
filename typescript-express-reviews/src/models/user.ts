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
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  }
}, { _id: false, versionKey: false });

schema.virtual('displayName').get(function() {
  return this.firstName + ' ' + this.lastName.slice(0, 1) + '.';
});

const User = mongoose.model('User', schema);

export default User;
