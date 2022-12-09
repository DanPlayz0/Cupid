const Command = require('@structures/framework/Command');
const Canvas = require('canvas');
const { GIF, decode, Image, Frame } = require('imagescript');

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      enabled: true,
      description: 'Add falling hearts to a static image.',
      options: [
        {
          type: 6,
          name: "image_user",
          description: "A user's avatar to use."
        },
        {
          type: 3,
          name: "image_url",
          description: "An image url to use."
        },
        {
          type: 11,
          name: "image",
          description: "An image to use."
        },
      ],
      category: "Image",
      cooldown: 6000
    })
  }

  async run(ctx) {
    let image1Url = ctx.args.getString('image_url') || ctx.args.getAttachment('image')?.url || ctx.args.getUser("image_user")?.avatarURL({ extension: "png", forceStatic: true });
    if(!image1Url) image1Url = ctx.author.avatarURL({ extension: "png", forceStatic: true });
    if(!['png', 'jpg', 'jpeg'].some(x=>image1Url.includes('.'+x))) return ctx.sendMsg("Both images must be either `png` or `jpg`");

    let timeTest = Date.now()
    const image1 = await Canvas.loadImage(image1Url);
    let fancyFrames = createFancyImage(image1);

    const frames = [];
    for (let frame of fancyFrames) {
      frame = await decode(frame.buffer);
      const image = new Image(frame.width, frame.height);
      image.composite(frame);
      frames.push(Frame.from(image, 25, 0, 0, Frame.DISPOSAL_BACKGROUND));
    }

    timeTest = Date.now() - timeTest

    return ctx.sendMsg({content: `Generated in ${timeTest} ms`, files:[
      {name: 'hearts.gif', attachment: Buffer.from(await new GIF([...frames]).encode(100)) }
    ]})
  }
} 

function createFancyImage (image) {
  const canvas = Canvas.createCanvas(500,500), context = canvas.getContext("2d");
  let spawnAmount = 100, items = [];
  for (var i = 0; i < spawnAmount; i++) {
    items.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 5 + 2, //min of 2px and max of 7px
      d: Math.random() + 1 //density of the flake
    })
  }

  const heart = createHeart();
  function drawFlakes() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0,0, canvas.width, canvas.height);
    context.globalAlpha = 0.7;
    for (var i = 0; i < spawnAmount; i++) {
      var f = items[i], radius = f.r*3;
      context.drawImage(heart, f.x, f.y, radius, radius);
    }
    context.globalAlpha = 1;
    moveFlakes();
    return {buffer: canvas.toBuffer(), width: canvas.width, height: canvas.height}
  }

  let angle = 0;
  function moveFlakes() {
    // angle += 0.01;
    for (var i = 0; i < spawnAmount; i++) {
      var f = items[i];
      f.y += Math.pow(f.d, 2) + 1;
      f.x += Math.sin(angle) * 2;
      if (f.y > canvas.height) {
        // items.splice(i,1)
        items[i] = { x: f.x, y: 0, r: f.r, d: f.d };
      }
    }
  }

  let generated = []
  for (let i = 0; i < 100; i++) generated.push(drawFlakes())
  return generated;
}

function createHeart () {
  const canvas = Canvas.createCanvas(202,202), context = canvas.getContext("2d");
  const size = 200; // Heart size
  const offset = 1; // Distance from wall
  
  context.moveTo(offset, offset + size/ 4);
  context.quadraticCurveTo(offset, offset, offset + size/ 4, offset);
  context.quadraticCurveTo(offset + size/ 2, offset, offset + size/ 2, offset + size/ 4);
  context.quadraticCurveTo(offset + size/ 2, offset, offset + size* 3/4, offset);
  context.quadraticCurveTo(offset + size, offset, offset + size, offset + size/ 4);
  context.quadraticCurveTo(offset + size, offset + size/ 2, offset + size* 3/4, offset + size* 3/4);
  context.lineTo(offset + size/ 2, offset + size);
  context.lineTo(offset + size/ 4, offset + size* 3/4);
  context.quadraticCurveTo(offset, offset + size/ 2, offset, offset + size/ 4);

  context.fillStyle = "red";
  context.save();
  context.clip();
  context.fill();
  context.restore();

  return canvas;
}