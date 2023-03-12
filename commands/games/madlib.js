const Command = require("@structures/framework/Command");
const { stripIndents } = require("common-tags");

const stories = {
  story1: {
    name: "Romantic Couple",
    variables: [
      { id: "User1", name: "Involved character/user 1", placeholder: "Olaf" },
      { id: "User2", name: "Involved character/user 2", placeholder: "Anna" },
      { id: "Place", name: "Place", placeholder: "the forest" },
      { id: "Item", name: "Item used", placeholder: "a teddy bear"}
    ],
    text: stripIndents`In a small [Place], [User1] met the love of their life. [User2] was everything they had ever wanted and more. They were drawn to each other's personalities and interests, bonding over their love for [Item]. Their love was pure and true. They did everything together and went to every [Place] imaginable. They were always by each other's side and never let go of each other's hands. They even exchanged [Item] as a symbol of their love. As the years passed, [User2] never forgot about the love they once shared with [User1]. [Item] was always by their side, a symbol of a love that was never meant to be. And despite the distance and time between them, the memory of [User1] and their love remained etched in [User2]'s heart forever.`,
    lastUpdate: '02-2023'
  },
  story2: {
    name: "Love Mission",
    variables: [
      { id: "User1", name: "Involved character/user 1", placeholder: "Olaf" },
      { id: "User2", name: "Involved character/user 2", placeholder: "Anna" },
      { id: "Place", name: "Place", placeholder: "the bedroom" },
      { id: "Item", name: "Item used", placeholder: "flowers"}
    ],
    text: stripIndents`[User1] was on a mission to find love. They had tried everything and gone to every [Place] imaginable. But it wasn't until they stumbled upon [User2] at a small coffee shop, that they knew they had found their soulmate. They approached [User2] with a bouquet of [Item]. Their love was the stuff of legends. They went on countless adventures together and tried new things. They visited new places and created new memories. They even wrote love letters to each other using their [Item]. When [User2] looked back on their life, the love they once shared with [User1] was one of the few bright spots. [Item] was a constant reminder of what could have been, and the memories they shared together in [Place] would always be treasured.`,
    lastUpdate: '02-2023'
  },
  story3: {
    name: "Heroic Prince",
    variables: [
      { id: "User1", name: "Involved character/user", placeholder: "Anna" },
      { id: "Place", name: "Place", placeholder: "the forest" },
      { id: "Item", name: "Item used", placeholder: "sword"}
    ],
    text: stripIndents`As a young prince in the kingdom of [Place], [User1] was already known for their bravery and sense of justice. When the [Item] was stolen, they saw it as their opportunity to prove themselves. Along the way, [User1] met a beautiful princess who helped them retrieve the [Item]. They fell in love and continued to fight against evil together, becoming the most powerful duo in the kingdom. With the [Item] back in the kingdom of [Place] and peace restored, [User1] stepped down as prince, content in knowing that they had made a difference and become a true hero.`,
    lastUpdate: '02-2023'
  },
  story4: {
    name: "Destined Prince",
    variables: [
      { id: "User1", name: "Involved character/user", placeholder: "Anna" },
      { id: "Place", name: "Place", placeholder: "the forest" },
      { id: "Item", name: "Item used", placeholder: "a knife"}
    ],
    text: stripIndents`[User1] was the prince of [Place], born with a destiny to save the kingdom from the evil sorcerer who had stolen the [Item]. [User1] encountered a wise old wizard who taught them magic, giving them the tools they needed to retrieve the stolen [Item] and defeat the evil sorcerer. With the [Item] back in their possession, [User1] returned to the kingdom of [Place] as a hero. They were greeted with cheers and accolades, their bravery and determination an inspiration to all.`,
    lastUpdate: '02-2023'
  },
  story5: {
    name: "Unbreakable Bond",
    variables: [
      { id: "User1", name: "Involved character/user 1", placeholder: "Alison" },
      { id: "User2", name: "Involved character/user 2", placeholder: "Isaac" },
      { id: "Place", name: "Place", placeholder: "canada" },
      { id: "Item", name: "Item used", placeholder: "a kiss"}
    ],
    text: stripIndents`[User1] and [User2] had been in love since the day they met at [Place]. They had been inseparable, doing everything together, until [User1] had to leave for a business trip to [Place]. They were each other's everything, but a family emergency soon pulled [User1] away from [User2], testing their love and devotion to each other. Their love had survived the toughest of tests, and they proved that it was indeed endless. They exchanged vows at a sunset ceremony at [Place], with [Item] as a symbol of their unbreakable bond.`,
    lastUpdate: '02-2023'
  },
  story6: {
    name: "Hopeless Romantic",
    variables: [
      { id: "User1", name: "Involved character/user 1", placeholder: "Mark" },
      { id: "User2", name: "Involved character/user 2", placeholder: "Taylor" },
      { id: "Place", name: "Place", placeholder: "the park" },
      { id: "Item", name: "Item used", placeholder: "titanium"}
    ],
    text: stripIndents`[User1] had always been a hopeless romantic and had been searching for their soulmate. When they finally met [User2] at [Place], they knew they had found their happily ever after. They fell deeper in love every day, but a twist of fate soon threatened to tear them apart. [User1] was offered a job opportunity in a different city and [User2] had to stay behind. Despite the distance and challenges, they never lost faith in their love. They proved that their love was stronger than anything life could throw at them. They reunited at [Place] and declared their love to the world, exchanging vows and rings made from [Item].`,
    lastUpdate: '02-2023'
  },
}

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      enabled: true,
      description: "Mad Lib Stories",
      category: "Games",
      options: [
        {
          name: "story",
          description: "The story to use.",
          type: 3,
          required: true,
          choices: Object.entries(stories).map(([customId, customValue], index) => ({
            name: `#${index + 1} - ${customValue.name}`, value: customId
          }))
        },
        {
          name: "action",
          description: "Preview or fill it out.",
          type: 3,
          required: false,
          choices: [
            { name: "Fill (default)", value: "fill" },
            { name: "Preview", value: "preview" },
          ]
        },
      ],
      defer: false,
    });
  }

  async run(ctx) {
    const storyArg = ctx.args.getString('story');
    const story = stories[storyArg];
    if (ctx.args.getString('action') == "preview")
      return ctx.sendMsg(story.text.replace(/(\[[^\]]+\])/g, '**$1**'), { ephemeral: true });

    ctx.interaction.showModal({
      title: story.name,
      custom_id: `madlib_${storyArg}_${story.lastUpdate}`,
      components: story.variables.map((x) => ({
        type: 1,
        components: [
          {
            type: 4,
            style: 1,
            custom_id: x.id,
            label: x.name,
            placeholder: x.placeholder,
            min_length: 1,
            max_length: 100,
          }
        ]
      }))
    })
  }

  async runStory(ctx) {
    const story = stories[ctx.interaction.customId.split('_')[1]];
    if (!story) return ctx.sendMsg("That story seems to have been deleted or no longer exists.", { ephemeral: true })

    let storyText = story.text;
    for (let field of ctx.interaction.fields.fields.values()) 
      storyText = storyText.replaceAll(`[${field.customId}]`, `**${field.value.trim()}**`);

    ctx.sendMsg(storyText);
  }
};