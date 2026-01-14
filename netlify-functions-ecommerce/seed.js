'use strict';

const models = require('./models');
const connect = require('./connect');
const mongoose = require('./mongoose');
const { tableDefinitionFromSchema, udtDefinitionsFromSchema } = require('@datastax/astra-mongoose');

async function createProducts() {
  await connect();

  await mongoose.connection.createKeyspace(mongoose.connection.keyspaceName);
  const tableNames = await mongoose.connection.listTables({ nameOnly: true });
  console.log('Found tables:', tableNames);
  const collectionNames = await mongoose.connection.listCollections({ nameOnly: true });
  console.log('Found collections:', collectionNames);

  if (process.env.DATA_API_TABLES) {
    const udtNames = await mongoose.connection.db.listTypes({ nameOnly: true });

    const modelEntries = Object.values(models);
    if (modelEntries.length > 0) {
      // Dedupe UDTs by name, verifying that each definition is identical
      const udts = udtDefinitionsFromSchema(modelEntries[0].schema);
      for (const Model of modelEntries.slice(1)) {
        const udtsToAdd = udtDefinitionsFromSchema(Model.schema);
        for (const [name, fields] of Object.entries(udtsToAdd)) {
          if (udts.hasOwnProperty(name)) {
            if (JSON.stringify(fields) !== JSON.stringify(udts[name])) {
              throw new Error('Conflicting UDTs found');
            }
          } else {
            udts[name] = fields;
          }
        }
      }

      const udtsList = Object.entries(udts).map(([name, definition]) => ({ name, definition }));
      await mongoose.connection.db.syncTypes(udtsList);
    }
  }

  for (const Model of Object.values(models)) {
    if (process.env.DATA_API_TABLES) {
      console.log(`Creating table ${Model.collection.collectionName}`);
      await mongoose.connection.collection(Model.collection.collectionName).syncTable(
        tableDefinitionFromSchema(Model.schema)
      );
    } else {
      if (tableNames.includes(Model.collection.collectionName)) {
        await mongoose.connection.dropTable(Model.collection.collectionName);
      }
      console.log(`Creating collection ${Model.collection.collectionName}`);
      await Model.createCollection();
    }
  }
  await Promise.all(
    Object.values(models).map(Model => Model.deleteMany({}))
  );
  const { Product } = models;

  await Product.create({
    name: 'iPhone 12',
    price: 499,
    image: '/images/iphone-12.png',
    description: '5G speed. A14 Bionic, the fastest chip in a smartphone. The iPhone 12 features Super Retina XDR display with a 6.1‐inch edge-to-edge OLED display, MagSafe wireless charging, Ceramic Shield with four times better drop performance and Night mode on every camera as well as Ultra Wide and Wide cameras.'
  });

  await Product.create({
    name: 'iPhone SE',
    price: 429,
    image: '/images/iphone-se.png',
    description: 'The new iPhone SE delivers best-in-class performance and great photos for an affordable price, if you can live with a small screen'
  });

  await Product.create({
    name: 'iPhone 12 Pro',
    price: 799,
    image: '/images/iphone-12-pro.png',
    description: 'Shoot amazing videos and photos with the Ultra Wide, Wide, and Telephoto cameras. Capture your best low-light photos with Night mode. Watch HDR movies and shows on the Super Retina XDR display—the brightest iPhone display yet. Experience unprecedented performance with A13 Bionic for gaming, augmented reality (AR), and photography. And get all-day battery life and a new level of water resistance. All in the first iPhone powerful enough to be called Pro.'
  });

  await Product.create({
    name: 'iPhone 11',
    price: 300,
    image: '/images/iphone-11.png',
    description: 'The iPhone 11 offers superb cameras, fast performance and excellent battery life for an affordable price'
  });

  const products = await Product.find();
  console.log('done', products.length, products);
  process.exit(0);
}

createProducts();
