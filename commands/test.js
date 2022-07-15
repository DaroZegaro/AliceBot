const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder().setName("test").setDescription("Does stuff"),
  async execute(interaction) {
    interaction.reply("Hello");
  },
};
