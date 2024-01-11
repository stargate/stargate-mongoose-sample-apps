'use strict';

require('dotenv').config();

// Require the necessary discord.js classes
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const assert = require('assert');
const fs = require('fs');
const path = require('node:path');
const mongoose = require('./mongoose');

const { createAstraUri } = require('stargate-mongoose');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

const {
  DISCORD_TOKEN: token
} = process.env;
assert.ok(token, 'Must set DISCORD_TOKEN environment variable');

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Set a new item in the Collection
  // With the key as the command name and the value as the exported module
  client.commands.set(command.data.name, command);
}

// When the client is ready, run this code (only once)
client.once('ready', async() => {
  console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

run();

async function run() {
  let uri = '';
  let jsonApiConnectOptions = {};
  if (process.env.IS_ASTRA === 'true') {
    uri = createAstraUri(process.env.ASTRA_DBID, process.env.ASTRA_REGION, process.env.ASTRA_KEYSPACE, process.env.ASTRA_APPLICATION_TOKEN);
    jsonApiConnectOptions = {
      isAstra: true
    };
  } else {
    uri = process.env.JSON_API_URL;
    jsonApiConnectOptions = {
      username: process.env.JSON_API_AUTH_USERNAME,
      password: process.env.JSON_API_AUTH_PASSWORD,
      authUrl: process.env.JSON_API_AUTH_URL
    };
  }
  console.log('Connecting to', uri);
  await mongoose.connect(uri, jsonApiConnectOptions);
  // Login to Discord with your client's token
  client.login(token);
}
