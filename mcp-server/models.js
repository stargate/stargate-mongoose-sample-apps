'use strict';

import mongoose from './mongoose.js';
import z from 'zod';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  }
}, { versionKey: false });

userSchema.statics.findByEmail = async function({ email }) {
  console.log('Find user by email', email);
  return { user: await this.findOne({ email }) };
};
userSchema.statics.findByEmail.mcpConfig = {
  description: 'Find a user by their email address.',
  inputSchema: { email: z.string() },
  outputSchema: {
    user: z.object({
      _id: z.any(),
      email: z.string(),
      firstName: z.string(),
      lastName: z.string()
    }).nullable()
  }
};

userSchema.statics.createUser = async function(user) {
  console.log('Create user', user);
  return { user: await this.create(user) };
};
userSchema.statics.createUser.mcpConfig = {
  description: 'Create a new user with email, firstName, and lastName.',
  inputSchema: {
    email: z.string(),
    firstName: z.string(),
    lastName: z.string()
  },
  outputSchema: {
    user: z.object({
      _id: z.any(),
      email: z.string(),
      firstName: z.string(),
      lastName: z.string()
    })
  }
};

const User = mongoose.model('User', userSchema);

export { User };
