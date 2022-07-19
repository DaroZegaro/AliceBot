const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("wave")
    .setDescription("MaKeS ThE OuTpUt LoOk LiKe ThIs")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The string to waveify")
        .setRequired(true)
    ),
  async execute(interaction) {
    const string = interaction.options.getString("message");

    const ans = string.split("").map((char, index) => {
      if (index % 2 == 1) return char.toUpperCase();
      else return char.toLowerCase();
    });

    interaction.reply({ content: ans.join(""), ephemeral: true });
  },
};
