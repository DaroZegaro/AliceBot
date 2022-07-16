const fs = require("node:fs");
const path = require("node:path");
const { Client, Intents, WebhookClient, Collection } = require("discord.js");
const { token, potentialMeows } = require("./config.json");
const { times } = require("./parse/times.json");
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
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
  parseTime(times);
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

function parseTime(times) {
  const now = new Date();
  times.forEach((elem) => {
    setTimeout(() => {
      client.channels.cache
        .find((c) => c.name === "general")
        .send(`<@${elem.userId}> ${elem.message}`);

      const newdb = JSON.parse(fs.readFileSync("./parse/times.json"));

      const write = {};

      write.times = newdb.times.filter(
        (t) =>
          t.message !== elem.message ||
          t.completeTime !== elem.completeTime ||
          t.userId !== elem.userId
      );

      fs.writeFileSync("./parse/times.json", JSON.stringify(write));
    }, elem.completeTime - now.getTime());
  });
}

setInterval(() => {
  const odd = Math.random();
  if (odd > 0.9)
    client.channels.cache.find((c) => c.name === "general").send("Meow!");
}, 60000);

client.login(token);
