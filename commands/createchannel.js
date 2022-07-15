const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("createchannel")
    .setDescription("Creates a channel with a given name")
    .addStringOption((option) =>
      option
        .setName("channelname")
        .setDescription("Name of the channel to create")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("channeltype")
        .setDescription("Either Voice or Text channel")
        .setRequired(true)
        .setChoices(
          { name: "Text Channel", value: "GUILD_TEXT" },
          { name: "Voice Channel", value: "GUILD_VOICE" }
        )
    ),
  async execute(interaction) {
    const { options } = interaction;
    const name = options.getString("channelname");
    const type = options.getString("channeltype");
    console.log(type);
    interaction.guild.channels.create(name, { type });
  },
};
