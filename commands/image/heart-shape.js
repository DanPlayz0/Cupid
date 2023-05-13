const Command = require('@structures/framework/Command');
const Canvas = require('canvas');

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      enabled: true,
      description: 'Convert an image into a heart.',
      options: [
        {
          type: 6,
          name: "image_user",
          description: "The user you'd like to convert."
        },
        {
          type: 3,
          name: "image_url",
          description: "The url you'd like to convert."
        },
        {
          type: 11,
          name: "image",
          description: "The first image you'd like to ship."
        },
        {
          type: 3,
          name: "background",
          description: "What should the background be?",
          choices: [
            { name: "Transparent (Default)", value: "none" },
            { name: "Red", value: "red" },
            { name: "Pink", value: "pink" },
            { name: "Purple", value: "purple" },
            { name: "Blue", value: "blue" },
            { name: "Yellow", value: "yellow" },
            { name: "Green", value: "green" },
          ]
        },
      ],
      category: "Image",
    })
  }

  async run(ctx) {
    let image1Url = (/^https?:\/\//.test(ctx.args.getString('image_url')) ? ctx.args.getString('image_url') : null) || ctx.args.getAttachment('image')?.url || ctx.args.getUser("image_user")?.avatarURL({ extension: "png", forceStatic: true });
    if (!image1Url) image1Url = ctx.author.avatarURL({ extension: "png", forceStatic: true });
    if (!['png', 'jpg', 'jpeg', 'gif'].some(x => image1Url.includes('.' + x))) return ctx.sendMsg("The image must be either `png` or `jpg` or `gif`");

    const image1 = await Canvas.loadImage(image1Url);
    const heart1 = createHeart(image1);

    const canvas = Canvas.createCanvas(202, 202), context = canvas.getContext('2d');

    const backgroundColor = ctx.args.getString('background');
    if (backgroundColor && backgroundColor != "none") {
      const colors = {
        "red": "FF0000",
        "pink": "FFC0CB",
        "white": "FFFFFF",
        "purple": "800080",
        "yellow": "FFFF00",
        "blue": "0000FF",
        "green": "00FF00",
      }
      context.fillStyle = "#" + colors[backgroundColor];
      context.fillRect(0, 0, canvas.width, canvas.height)
    }
    context.drawImage(heart1, 0, 0);

    return ctx.sendMsg({
      files: [
        { name: 'ship.png', attachment: canvas.toBuffer() }
      ]
    })
  }
}

function createHeart(image) {
  const canvas = Canvas.createCanvas(202, 202), context = canvas.getContext("2d");
  const size = 200; // Heart size
  const offset = 1; // Distance from wall

  context.moveTo(offset, offset + size / 4);
  context.quadraticCurveTo(offset, offset, offset + size / 4, offset);
  context.quadraticCurveTo(offset + size / 2, offset, offset + size / 2, offset + size / 4);
  context.quadraticCurveTo(offset + size / 2, offset, offset + size * 3 / 4, offset);
  context.quadraticCurveTo(offset + size, offset, offset + size, offset + size / 4);
  context.quadraticCurveTo(offset + size, offset + size / 2, offset + size * 3 / 4, offset + size * 3 / 4);
  context.lineTo(offset + size / 2, offset + size);
  context.lineTo(offset + size / 4, offset + size * 3 / 4);
  context.quadraticCurveTo(offset, offset + size / 2, offset, offset + size / 4);

  context.stroke();

  context.save();
  context.clip();
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  context.restore();

  return canvas;
}