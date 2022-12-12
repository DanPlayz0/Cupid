const Command = require("@structures/framework/Command");

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      enabled: true,
      description: "How many days until Valentine's Day.",
      category: "Text",
    });
  }

  async run(ctx) {
    const currentDate = new Date();

    let year = currentDate.getFullYear()
    if(currentDate.getMonth() == 2 && currentDate.getDate() < 14) year = currentDate.getFullYear();
    else if (currentDate.getMonth() == 2 && currentDate.getDate() > 14) year = currentDate.getFullYear()+1;
    else if (currentDate.getMonth() > 2) year = currentDate.getFullYear()+1
    else year = currentDate.getFullYear()

    const date = new Date(`${year}-02-14`);
    ctx.sendMsg(`There is ${Math.round((date.getTime() - Date.now()) / 86400000)} days before Valentine's Day (<t:${date.getTime()/1000}:R>)`);
  }
};