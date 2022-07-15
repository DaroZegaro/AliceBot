const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("insult")
    .setDescription("Anonymously throw an insult at someone!")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user you want to throw the insult at")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("insult")
        .setDescription("Content of the insult")
        .setRequired(true)
    ),
  async execute(interaction) {
    const { options } = interaction;
    const user = options.getUser("user");
    const insult = options.getString("insult");

    await interaction.channel.send(`${user} ${insult}`);

    await interaction.reply({
      content: `Insulted ${user.username}!`,
      ephemeral: true,
    });
  },
};
