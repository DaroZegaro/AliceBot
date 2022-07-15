const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageAttachment } = require("discord.js");
const wait = require("node:timers/promises").setTimeout;
module.exports = {
  data: new SlashCommandBuilder()
    .setName("image")
    .setDescription("Sends an image"),
  async execute(interaction) {
    //await interaction.reply({ content: "test", files: "./background.png" });
    await interaction.deferReply({ ephemeral: true });
    await wait(3000);
    await interaction.editReply({
      content: `hello`,
      files: ["./images/background.png"],
    });
  },
};
