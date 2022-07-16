const { SlashCommandBuilder } = require("@discordjs/builders");
const timestring = require("timestring");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("startcollecting")
    .setDescription("Deploys a message collector in the current channel")
    .addStringOption((option) =>
      option
        .setName("phrase")
        .setDescription("Phrase to look for")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("duration")
        .setDescription("How long to look for")
        .setRequired(true)
    ),
  async execute(interaction) {
    const { options } = interaction;
    const phrase = options.getString("phrase");
    const duration = options.getString("duration");

    const collector = interaction.channel.createMessageCollector({
      filter: (m) => m.content.includes(phrase),
      time: timestring(duration) * 1000,
    });

    collector.on("collect", (message) => {
      console.log(`Collected ${message.content}`);
    });
    collector.on("end", (collected) => {
      interaction.channel.send(
        `Collected ${collected.size} messages in total!`
      );
    });

    interaction.reply("Started a new message collector!");
  },
};
