# discord-bot

This sample demonstrates using Mongoose to build a sample 
[Discord](https://discord.com) bot.

## Setup

Make sure you have a local Stargate instance running as described on the [main page](../README.md) of this repo.

## Running This Example

Due to Discord dependencies, this sample app requires Node >= 18.

1. Create a `.env` file with the keys from `.env.example` and the values from the developer portal and your Discord server.*
1. Run `npm install`
1. Run `npm run seed` to create the Bot collection in Astra
1. Run `node ./deploy-commands.js`
1. Run `node ./index.js`

* `DISCORD_GUILD_ID`: go into your server's settings and click on "Widget". The "Server ID" is the `guildId`. See screenshot 1 below.
* `DISCORD_CLIENT_ID`: go to the [Discord developer portal](https://discord.com/developers/applications), click your bot, and then click "OAuth2". The "Application ID" is the `clientId`. See screenshot 2 below.
* `DISCORD_TOKEN`: go to the [Discord developer portal](https://discord.com/developers/applications). Navigate to OAuth2 -> URL Generator", select 'bot' in the SCOPES and 'Use Slash Commands' in the 'BOT PERMISSIONS' section. Copy the URL that is generated, go to the URL on a new tab, and authorize as required. Then go back to the Discord developer portal, click on your bot under "My Applications", click on the "Bot" tab, and find the token under "Build-A-Bot". See screenshot 3 below.
* Make sure to enable slash commands when selecting bot permissions.

For more information on setting up your bot and adding it to your server: https://discordjs.guide/preparations/setting-up-a-bot-application.html

<img src="https://user-images.githubusercontent.com/1620265/226195771-52cad494-ad35-4098-83fd-b22001fc2de9.png">

<img src="https://user-images.githubusercontent.com/1620265/226195959-ade64ca0-1279-438e-beae-4793ed877cc4.png">

<img src="https://user-images.githubusercontent.com/1620265/226196076-947e5afa-d6ba-4e8c-ab94-8a937dc4dc0e.png">

## Commands

Once the Discord bot is running, you should also see the bot "Online" in the Discord server's members list as shown in the following screenshot.

![image](https://user-images.githubusercontent.com/1620265/228900485-9dd50041-f0de-48db-89ad-fec0c7664b92.png)

You should be able to execute the following commands in the "general" chat under "TEXT-CHANNELS"

- `/ping`: replies "Pong!"
- `/count`: returns the number of documents currently in your local MongoDB collection.
- `/createdocument`: inserts a new document into your local MongoDB collection.

Below is a screenshot demonstrating executing each of the commands.

![image](https://user-images.githubusercontent.com/1620265/213293087-53505a73-3038-4db8-b21b-d9149a5396ed.png)

Anytime you add or update commands in the command folder, run step 3 again.

## With tables

Create table:

```
CREATE TABLE bots (
   "_id"        text, 
   name         text,
   PRIMARY KEY ("_id"));
```