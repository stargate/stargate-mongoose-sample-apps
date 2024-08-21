import dotenv from 'dotenv';
dotenv.config();

import connect from '../models/connect';
import mongoose from '../models/mongoose';

import Authentication from '../models/authentication';
import Review from '../models/review';
import User from '../models/user';
import Vehicle from '../models/vehicle';
import bcrypt from 'bcryptjs';

import util from 'util';
util.inspect.defaultOptions.depth = 6;

run().catch(err => {
  console.error(err);
  process.exit(-1);
});

async function run() {
  await connect();

  /*const existingCollections = await mongoose.connection.listCollections()
    .then(collections => collections.map(c => c.name));

  for (const Model of Object.values(mongoose.connection.models)) {
    
    // First ensure the collection exists
    if (!existingCollections.includes(Model.collection.collectionName)) {
      console.log('Creating collection', Model.collection.collectionName);
      await mongoose.connection.createCollection(Model.collection.collectionName);
    } else {
      console.log('Resetting collection', Model.collection.collectionName);
    }
    // Then make sure the collection is empty
    await Model.deleteMany({});
  }*/

  const users = await User.insertMany([
    {
      first_name: 'Dominic',
      last_name: 'Toretto',
      email: 'dom@fastandfurious.com'
    },
    {
      first_name: 'Brian',
      last_name: 'O\'Connor',
      email: 'brian@fastandfurious.com'
    }
  ]);
  for (let i = 0; i < users.length; i++) {
    await Authentication.insertMany([{
      type: 'password',
      user_id: users[i].id,
      secret: await bcrypt.hash(users[i].first_name.toLowerCase(), 10)
    }]);
  }
  const vehicles = await Vehicle.insertMany([
    {
      id: '0'.repeat(24),
      make: 'Tesla',
      model: 'Model S',
      year: 2022,
      images: [
        'https://tesla-cdn.thron.com/delivery/public/image/tesla/6139697c-9d6a-4579-837e-a9fc5df4a773/bvlatuR/std/1200x628/Model-3-Homepage-Social-LHD',
        'https://www.tesla.com/sites/default/files/images/blogs/models_blog_post.jpg'
      ],
      num_reviews: 0,
      average_reviews: 0
    },
    {
      id: '1'.repeat(24),
      make: 'Porsche',
      model: 'Taycan',
      year: 2022,
      images: [
        'https://www.motortrend.com/uploads/sites/5/2020/02/2020-Porsche-Taycan-Turbo-S-Track-Ride-5.gif?fit=around%7C875:492',
        'https://newsroom.porsche.com/.imaging/mte/porsche-templating-theme/image_1290x726/dam/pnr/2021/Products/Free-Software-Update-Taycan/Free-Software-Update-for-early-Porsche-Taycan_2.jpeg/jcr:content/Free%20Software-Update%20for%20early%20Porsche%20Taycan_2.jpeg'
      ],
      num_reviews: 0,
      average_reviews: 0
    }
  ]);

  await Review.insertMany([
    {
      vehicle_id: vehicles[1].id,
      user_id: users[0].id,
      text: 'When you live your life a quarter of a mile at a time, it ain\'t just about being fast. I needed a 10 second car, and this car delivers.',
      rating: 4
    },
    {
      vehicle_id: vehicles[0].id,
      user_id: users[1].id,
      text: 'I need NOS. My car topped out at 140 miles per hour this morning.',
      rating: 3
    }
  ]);

  console.log('Done');
}
