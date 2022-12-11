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
  },
  story2: {
    name: "Love in Bloom",
    variables: [
      { name: "Name", placeholder: "person named [name] decided to" },
      { name: "Action", placeholder: "They [action] a bouquet of" },
      { name: "Item", placeholder: "bouquet of [item], and waited" },
      { name: "Emotion", placeholder: "was overcome with [emotion] and" },
      { name: "Adjective", placeholder: "believe the [adjective] effort their" },
    ],
    text: stripIndents`Once upon a morning on Valentine's Day, a person named [name] decided to surprise their loved one with a gesture. 
    They [action] a bouquet of [item], and waited anxiously for their partner to arrive home. 
    When they finally did, the loved one was overcome with [emotion] and couldn't believe the [adjective] effort their partner had put in. 
    It was a day they would never forget.`,
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
    const storyArg = ctx.args.getString('story')
    const story = stories[storyArg];
    if(ctx.args.getString('action') == "preview") 
      return ctx.sendMsg(story.text.replace(/(\[[^\]]+\])/g, '__**$1**__'), {ephemeral: true});

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