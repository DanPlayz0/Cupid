const Command = require('@structures/framework/Command');
module.exports = class extends Command {
  constructor(client) {
    super(client, {
      enabled: true,
      description: 'Get a list of commands.',
      options: [
        {
          // Full list of valid types
          // https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-type

          type: 3, // STRING = 3
          name: 'command',
          description: 'The full name of the command to view.',
          autocomplete: true,
        }
      ],
      category: "General",
    })

    // The line below defines text based commands to run the 'run' function
    this.runMessage = this.run;
  }

  async run(ctx) {
    const embed = new ctx.MessageEmbed().setColor('#E6ACB6');

    if (ctx.args.getString('command')) return this.commandInfo(ctx, ctx.args.getString('command'), embed);

    const categories = [...new Set(ctx.client.commands.map(x => x.conf.category))]

    embed
      .setAuthor({ name: ctx.client.user.username, iconURL: ctx.client.user.displayAvatarURL({ dynamic: true, format: 'png' }) })
      .setDescription(`You can do \`${ctx.prefix}help [command]\` for more info on a command\nYou can also join the [support server](${ctx.client.config.supportServerInvite}) for more information.`)
      .setFields(categories.map((x) => ({
        name: `${x.toProperCase()}`, value: ctx.client.commands.filter(m => m.conf.category == x).map(m => `\`${m.commandData.name}\``).join(' ') || 'None', inline: false
      })))
    ctx.sendMsg(embed)
  }
  async commandInfo(ctx, command, embed) {
    if (!ctx.client.commands.has(command)) {
      embed
        .setTitle('Something went wrong!')
        .setColor('Red')
        .setDescription(`It seems **${command}** not a valid command name`);
    } else {
      command = ctx.client.commands.get(command);
      embed
        .setTitle(`Help » ${command.commandData.name.toProperCase()}`)
        .setDescription(`\`\`\`asciidoc\nDescription:: ${command.commandData.description}\nUsage:: ${ctx.prefix}${command.commandData.name} ${command.commandData.options.map(m => m.required ? `<${m.name}>` : `[${m.name}]`).join(' ')}\nCategory:: ${command.conf.category}\`\`\``)
    }
    return ctx.sendMsg(embed);
  }

  // The function below handles autocomplete options
  async runAutocomplete(ctx) {
    const focused = ctx.args.getFocused(true); // true returns an object rather than a typeof "string | null"
    // Check for option name, this way you can return different values based on the option.
    if (focused.name === 'command') {
      return [...ctx.client.commands.keys()].map(x => ({ name: x, value: x })).filter(a => a.name?.toLowerCase().includes(focused.value?.toLowerCase()))
    }
  }
}