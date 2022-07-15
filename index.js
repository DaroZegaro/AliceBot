const fs = require("node:fs");
const path = require("node:path");
const { Client, Intents, WebhookClient, Collection } = require("discord.js");
const { token, potentialMeows } = require("./config.json");

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
});
const hook = new WebhookClient({
  url: `https://discord.com/api/webhooks/996466948953092176/98r-BzrMp0CIyEOOWbluAsCTpFggaa0x8E1dI6O6X9WBOfkZNlOVKHBZ4HphZq206Z2S`,
});
client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  console.log(`Loading ${command.data.name}...`);
  client.commands.set(command.data.name, command);
}

client.once("ready", async () => {
  // const channel = client.channels.cache.get("970094181852786730");
  // const webhooks = await channel.fetchWebhooks();
  // const webhook = webhooks.find((wh) => wh.token);
  // webhook.send({
  //   content: "Webhook test",
  //   username: "some-username",
  //   avatarURL: "https://i.imgur.com/AfFp7pu.png",
  // });
  console.log("Ready!");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.on("messageCreate", (message) => {
  if (message.author.bot || message.webhookId) return;
  const { content } = message;
  const capitalized = content[0].toUpperCase() + content.slice(1);
  if (potentialMeows.includes(content.toLowerCase()))
    message.reply(`${capitalized}!`);

  webhookFuckery(message);
  // hook.edit({
  //   channel: "997555221569994812",
  //   name: message.author.username,
  //   avatarURL: message.author.displayAvatarURL(),
  // });
  // hook.send({
  //   content: message.content,
  // });
});

async function webhookFuckery(message) {
  const { channel } = message;
  const { cache: channels } = message.guild.channels;
  if (!channels.find((c) => c.name === `${channel.name}-log`)) {
    console.log("Couldn't find the channel");
    await channels
      .find((c) => c.name.toLowerCase() === "log channels")
      .createChannel(`${channel.name}-log`, { type: "GUILD_TEXT" });
  }

  channels
    .find((c) => c.name.toLowerCase() === `${channel.name}-log`)
    .createWebhook(message.author.username, {
      avatar: message.author.displayAvatarURL(),
    })
    .then((webhook) => webhook.send(message.content));
}

setInterval(() => {
  const odd = Math.random();
  if (odd > 0.9) client.channels.cache.get("970094181852786730").send("Meow!");
}, 60000);

client.login(token);
