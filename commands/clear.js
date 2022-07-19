const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Deletes the specified number of messages")
    .addIntegerOption((option) =>
      option
        .setName("number")
        .setDescription("The number of messages to delete")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(1 << 13),
  async execute(interaction) {
    const number = interaction.options.getInteger("number");
    try {
      await interaction.channel.bulkDelete(number);

      return interaction
        .reply({
          content: `Succesfully deleted \`${number}\` messages!`,
          fetchReply: true,
        })
        .then((message) => setTimeout(() => message.delete(), 2000));
    } catch (e) {
      console.log(e);
      return interaction
        .reply({
          content: "The attempt to bulk delete the messages has failed",
          ephemeral: true,
          fetchReply: true,
        })
        .then((message) => setTimeout(() => message.delete(), 2000));
    }
  },
};
