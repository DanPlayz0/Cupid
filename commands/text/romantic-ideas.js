const Command = require("@structures/framework/Command");
const romanticIdeas = [
  "Plan a special dinner for two at a fancy restaurant or at home.",
  "Go on a romantic picnic in a scenic location, such as a park or a beach.",
  "Take a couples massage or spa day together.",
  "Go on a sunset boat ride or a hot air balloon ride.",
  "Plan a special date night, such as seeing a play or a movie, or going to a comedy show.",
  "Take a dance class together, or have a private dance lesson.",
  "Go on a hiking or a biking adventure in a beautiful location.",
  "Plan a surprise outing, such as a trip to a nearby city or a visit to a local attraction.",
  "Write each other love letters or create a scrapbook of memories together.",
  "Have a special couples photo shoot to capture the memories of your love.",
  "Book a couples massage or a spa day together.",
  "Go on a sunset boat ride or a hot air balloon ride.",
  "Plan a special date night, such as seeing a play or a movie, or going to a comedy show.",
  "Take a dance class together, or have a private dance lesson.",
  "Go on a hiking or a biking adventure in a beautiful location.",
  "Plan a surprise outing, such as a trip to a nearby city or a visit to a local attraction.",
  "Write each other love letters or create a scrapbook of memories together.",
  "Have a special couples photo shoot to capture the memories of your love.",
  "Book a couples massage or a spa day together.",
  "Go on a sunset boat ride or a hot air balloon ride."
];

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      enabled: true,
      description: "Random romantic date idea.",
      category: "Text",
      options: [
        {
          name: "idea",
          description: "The romantic date idea number to show.",
          type: 4,
          required: false,
          min_value: 1,
          max_value: romanticIdeas.length,
        },
      ],
    });
  }

  async run(ctx) {
    const ideaNumber = ctx.args.getInteger('idea') ?? (Math.floor(Math.random() * romanticIdeas.length) + 1);
    ctx.sendMsg(`**#${ideaNumber}:** ${romanticIdeas[ideaNumber - 1]}`)
  }
};