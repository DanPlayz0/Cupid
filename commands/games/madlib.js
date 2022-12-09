const Command = require("@structures/framework/Command");
const { stripIndents } = require("common-tags");

const stories = {
  story1: {
    name: "A grumpy valentine",
    variables: [
      { name: "Adjective", placeholder: "what the [adjective] deal is" },
      { name: "Noun", placeholder: "why every [noun] in the" },
      { name: "Shape", placeholder: "all the [shape] decorations" },
      { name: "Color", placeholder: "everything is covered in [color]" },
    ],
    text: stripIndents`I don't get what the [adjective] deal is... to me,
    Feb. 14 is just another day. I really don't understand
    why every [noun] in the world loves this day so
    much. First of all, there are all the [shape]
    decorations, and everything is covered in [color]`,
    lastUpdate: '12-2022-test'
  }
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
          choices: Object.entries(stories).map(([customId,customValue], index) => ({
            name: `#${index+1} - ${customValue.name}`, value: customId
          }))
        },
      ],
      defer: false,
    });
  }

  async run(ctx) {
    const storyArg = ctx.args.getString('story')
    const story = stories[storyArg];
    ctx.interaction.showModal({
      title: story.name,
      custom_id: `madlib_${storyArg}_${story.lastUpdate}`,
      components: story.variables.map((x) => ({
        type: 1,
        components: [
          {
            type: 4,
            style: 1,
            custom_id: x.name.toLowerCase(),
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
    if (!story) return ctx.sendMsg("That story seems to have been deleted or no longer exists.", {ephemeral:true})
    
    let storyText = story.text;
    for (let field of ctx.interaction.fields.fields.values()) 
      storyText = storyText.replaceAll(`[${field.customId}]`, `__${field.value}__`);

    ctx.sendMsg(storyText);
  }
};