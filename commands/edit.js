const { SlashCommandBuilder } = require("@discordjs/builders");
const { wait } = require("node:timers/promises").setTimeout;
const { request } = require("undici");
const { readFile } = require("fs/promises");
const Canvas = require("@napi-rs/canvas");
const { MessageAttachment } = require("discord.js");

const applyText = (canvas, text) => {
  const context = canvas.getContext("2d");

  // Declare a base size of the font
  let fontSize = 70;

  do {
    // Assign the font to the context and decrement it so it can be measured again
    context.font = `${(fontSize -= 10)}px sans-serif`;
    // Compare pixel width of the text to the canvas minus the approximate avatar size
  } while (context.measureText(text).width > canvas.width - 300);

  // Return the result to use in the actual canvas
  return context.font;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("edit")
    .setDescription("Sends an image"),
  async execute(interaction) {
    const canvas = Canvas.createCanvas(750, 250);
    const context = canvas.getContext("2d");

    const backgroundFile = await readFile("./images/background.png");
    const background = new Canvas.Image();
    background.src = backgroundFile;

    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    context.strokeStyle = "#000000";

    context.strokeRect(0, 0, canvas.width, canvas.height);

    context.font = applyText(canvas, `${interaction.member.displayName}`);

    context.fillStyle = "#000000";

    context.fillText(
      `${interaction.member.displayName}`,
      canvas.width / 2,
      canvas.height / 1.8
    );

    context.beginPath();

    context.arc(125, 125, 100, 0, Math.PI * 2, true);

    context.closePath();

    context.clip();

    const { body } = await request(
      interaction.user.displayAvatarURL({ format: "jpg" })
    );
    const avatar = new Canvas.Image();
    avatar.src = Buffer.from(await body.arrayBuffer());

    context.drawImage(avatar, 25, 25, 200, 200);
    const attachement = new MessageAttachment(
      canvas.toBuffer("image/png"),
      "profile-image.png"
    );

    interaction.reply({ files: [attachement] });
  },
};
