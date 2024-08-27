'use strict';

const { SlashCommandBuilder } = require('discord.js');
const Bot = require('../models/bot');

module.exports = {
  data: new SlashCommandBuilder().setName('createdocument').setDescription('creates a document'),
  async execute(interaction) {
    console.log(new Date(), 'createdocument');
    await Bot.create({ name: 'I am a document' });
    await interaction.reply('done!');
  }
};