'use strict';

require('dotenv').config();

// Require the necessary discord.js classes
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const assert = require('assert');
const fs = require('fs');
const path = require('node:path');
const mongoose = require('./mongoose');

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
  const url = process.env.ASTRA_JSON_API_URL || process.env.STARGATE_JSON_API_URL;
  const isAstra = process.env.ASTRA_JSON_API_URL;
  const options = isAstra ? { createNamespaceOnConnect: false } : {
    username: process.env.STARGATE_JSON_USERNAME,
    password: process.env.STARGATE_JSON_PASSWORD,
    authUrl: process.env.STARGATE_JSON_AUTH_URL
  };
  console.log('Connecting to', url);
  await mongoose.connect(url, options);
  // Login to Discord with your client's token
  client.login(token);
}
