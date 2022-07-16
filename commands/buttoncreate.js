const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("buttoncreate")
    .setDescription("Creates a button")
    .addStringOption((option) =>
      option.setName("label").setDescription("The text on the button")
    ),
  async execute(interaction) {
    let label = interaction.options.getString("label") || " ";

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("eggplant")
        .setLabel(label)
        .setStyle("PRIMARY")
        .setEmoji("🍆")
    );

    await interaction.reply({
      content: "Here's your button :3",
      components: [row],
    });

    const collector = interaction.channel.createMessageComponentCollector({
      filter: (button) => button.customId === "eggplant",
      time: 3600000,
    });

    collector.on("collect", async (button) => {
      interaction.channel.send("🍑");
    });
  },
};
