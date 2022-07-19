const { SlashCommandBuilder } = require("@discordjs/builders");
const fs = require("node:fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setmeow")
    .setDescription("Tells the bot whether to meow or not")
    .addBooleanOption((option) =>
      option
        .setName("state")
        .setDescription("The state to set")
        .setRequired(true)
    ),
  async execute(interaction) {
    const file = JSON.parse(fs.readFileSync("./config.json"));

    const state = interaction.options.getBoolean("state");

    file.meowToggle = state;

    fs.writeFileSync("./config.json", JSON.stringify(file));

    interaction
      .reply({
        content: `Toggled the meowing ${state ? "on" : "off"}!`,
        fetchReply: true,
      })
      .then((message) => setTimeout(() => message.delete(), 2000));
  },
};
