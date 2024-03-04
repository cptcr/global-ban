const { AttachmentBuilder, MessageType, Client, Partials, GatewayIntentBits, PermissionFlagsBits, EmbedBuilder, PermissionsBitField, Permissions, MessageManager, Embed, Collection, Events, AuditLogEvent, MessageCollector, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require(`discord.js`);
const fs = require('fs');

//const func = require("./functions");

const functionsExt = fs.readdirSync('./src/functions');

const client = new Client({ 
  intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
  ],
  partials: [
      Partials.Channel, 
      Partials.Reaction, 
      Partials.Message
  ],
  allowedMentions: {
  parse: [`users`, `roles`],
  repliedUser: true,
  }
}); 

module.exports = { client }

client.commands = new Collection();

require('dotenv').config();

const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js")); 
const commandFolders = fs.readdirSync("./src/commands");

//Anti Crash System
const process = require("node:process");
const mongoose = require('mongoose');
const mongodbURL = process.env.MONGODBURL;

//MONGODB Check
if (!mongodbURL) return console.log("Error: Cannot find MongodbURL. File: *.env*");
mongoose.set('strictQuery', false);
try {
  mongoose.connect(mongodbURL || '', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
} catch (err) {
  process.exit(1)
}


(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleEvents(eventFiles, "./src/events");
    client.handleCommands(commandFolders, "./src/commands");
})();
client.login(process.env.token)

var count = 0;
// Load handlers
fs.readdirSync('./src/Event Handler').forEach((dir) => {
  fs.readdirSync(`./src/Event Handler/${dir}`).forEach((handler) => {
      require(`./Event Handler/${dir}/${handler}`)(client);
      count++
  }); 
});

console.log(`Found ` ,count, ` Event Files`)