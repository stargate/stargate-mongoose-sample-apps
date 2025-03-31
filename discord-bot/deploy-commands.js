'use strict';

const { Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const assert = require('assert');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

const {
  DISCORD_GUILD_ID: guildId,
  DISCORD_CLIENT_ID: clientId,
  DISCORD_TOKEN: token
} = process.env;
assert.ok(guildId, 'Must set DISCORD_GUILD_ID environment variable');
assert.ok(clientId, 'Must set DISCORD_CLIENT_ID environment variable');
assert.ok(token, 'Must set DISCORD_TOKEN environment variable');

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  console.log(filePath);
  const command = require(filePath);
  console.log(command);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
  .then((data) => console.log(`Successfully registered ${data.length} application commands.`))
  .catch(console.error);
