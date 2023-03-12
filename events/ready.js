const Event = require('@structures/framework/Event');
module.exports = class extends Event {
  constructor(client) {
    super(client, {
      enabled: true,
    });
  }

  async run(client) {
    console.log(`Logged in as ${client.user.tag}`);

    async function setupInit() {
      // Set the game as the "Watching for tags"
      client.user.setActivity(`with hearts • /help`, { type: 1 });
    }

    setupInit();
    this.activityInterval = setInterval(setupInit, 90000);

    // Setup the website.
    if((!client.shard || !client.shardId) && client.config.restapi.port != null) {
      client.site = new (require("@structures/restapi/index.js"))(client);
      client.site.listen(client.config.restapi.port);
    }
    
    const checkApplicationCommands = async (client) => {
      const clientCommands = await client.application.commands.fetch();
      client.savedCommands = clientCommands;
      const commandsDiff = [...Object.values(clientCommands.toJSON()).filter((command) => {
          const cmd = client.commands.get(command.name)?.commandData;
          if(!cmd) return true;
          if(command.description !== cmd.description) return true;
          if(command.options.length !== cmd.options.length) return true;
          const discordOptions = command.options.map(x=>`${x.type}|${x.name}|${x.description}|${x.required}|${x.choices?.length}|${x.options?.length}`);
          const localOptions = cmd.options.map(x=>`${x.type}|${x.name}|${x.description}|${x.required??false}|${x.choices?.length}|${x.options?.length}`);
          if(discordOptions.filter((x,i) => localOptions[i] !== x).length) return true;
          return false;
        }),
        ...[...client.commands.keys()].filter(x=> !Object.values(clientCommands.toJSON()).some(a => a.name === x))
      ]
      if(commandsDiff.length) {
        client.savedCommands = await client.application.commands.set(client.commands.map(x=>x.commandData));
        console.log('Detected a change, posting slash commands.');
      }
    };
    checkApplicationCommands(client);
  }
}