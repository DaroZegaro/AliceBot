const { SlashCommandBuilder } = require("@discordjs/builders");
const timestring = require("timestring");
const fs = require("node:fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remindme")
    .setDescription("Sets a reminder")
    .addStringOption((option) =>
      option
        .setName("remindmessage")
        .setDescription("The message you get reminded with")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("remindtime")
        .setDescription("When do you want to be reminded")
        .setRequired(true)
    ),
  async execute(interaction) {
    const { options } = interaction;

    const rTime = options.getString("remindtime");
    const rMessage = options.getString("remindmessage");

    const now = new Date();
    const secondsFromNow = timestring(rTime);

    const db = JSON.parse(fs.readFileSync("./parse/times.json"));

    db.times.push({
      message: rMessage,
      completeTime: now.getTime() + secondsFromNow * 1000,
      userId: interaction.user.id,
    });

    fs.writeFileSync("./parse/times.json", JSON.stringify(db));

    interaction.reply({ content: "Reminder set!", ephemeral: true });

    setTimeout(() => {
      interaction.guild.channels.cache
        .find((c) => c.name === "general")
        .send(`${interaction.user} ${rMessage}`);

      const newdb = JSON.parse(fs.readFileSync("./parse/times.json"));

      const write = {};

      write.times = newdb.times.filter(
        (t) =>
          t.message !== rMessage ||
          t.completeTime !== now.getTime() + secondsFromNow * 1000 ||
          t.userId !== interaction.user.id
      );

      fs.writeFileSync("./parse/times.json", JSON.stringify(write));
    }, secondsFromNow * 1000);
  },
};
