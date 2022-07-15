const { SlashCommandBuilder } = require("@discordjs/builders");
const all = require("../index");
const _eval = require("eval");
let x = 0;
let that = this;
console.log(this);
module.exports = {
  data: new SlashCommandBuilder()
    .setName("eval")
    .setDescription("Runs a JS script!")
    .addStringOption((option) =>
      option
        .setName("command")
        .setDescription("command to run")
        .setRequired(true)
    ),
  async execute(interaction) {
    const command = interaction.options.getString("command");
    console.log(command);
    output = new Function(command);
    output.bind(that);
    const ans = output.call({});
    if (typeof ans !== "undefined") {
      return interaction.reply(
        `Succesfully exectued your command!
    The output is:
    ${ans}`
      );
    }
    return interaction.reply({
      content: "There was an error when trying to execute your command!",
      ephemeral: true,
    });
  },
};
function test() {
  return x;
}
