const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("execute")
    .setDescription("Runs a JS script!")
    .addStringOption((option) =>
      option
        .setName("command")
        .setDescription("command to run")
        .setRequired(true)
    ),
  async execute(interaction) {
    const command = interaction.options.getString("command");
    const client = interaction.client;
    output = new Function("client", "interaction", command);
    try {
      const ans = output.call({}, client, interaction);
      if (typeof ans !== "undefined") {
        return interaction.reply(
          `Succesfully exectued your command!
    The output is:
    ${ans}`
        );
      } else {
        interaction.reply({
          content: "No output to be had",
          ephemeral: true,
        });
      }
    } catch {
      return interaction.reply({
        content: "There was an error when trying to execute your command!",
        ephemeral: true,
      });
    }
  },
};
