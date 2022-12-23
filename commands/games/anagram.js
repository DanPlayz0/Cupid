const Command = require("@structures/framework/Command");
const Canvas = require('canvas');

Canvas.registerFont(require('path').join(process.cwd(), "assets", "fonts", "RetrcadeRegular.ttf"), {
  family: "Retrcade"
})

const words = [
  "love", "heart", "cupid",
  "valentine", "romance", "chocolate",
  "rose", "gift", "kiss", "red", "sweetheart",
  "romantic", "date", "dinner", "flowers", "candy",
  "teddy bear", "perfume", "soulmate", "lovebirds", "dance",
  "affair", "lovenote", "promise", "fire",
  "poppy", "kind", "selfless", "passionate",
  "forever", "treasure", "journey",
  "admirer", "adore", "affection", "darling", "desire",
  "endearment", "fiance", "flirt", "friend", "girlfriend",
  "boyfriend", "holiday", "like", "moonstruck", "party",
  "passion", "pink", "presents", "present", "smitten",
  "sweets", "sweet", "lolipop", "tulips", "woo", "yearning",
];

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      enabled: true,
      description: "Unscramble the word",
      category: "Games",
      options: [
        {
          name: "word",
          description: "A custom word to use.",
          type: 3,
          required: false,
          min_length: 1,
          max_length: 100,
        },
      ],
    });
  }

  async run(ctx) {
    let anagramWord = ctx.args.getString('word');
    anagramWord = anagramWord ?? words[Math.floor(Math.random() * words.length)];

    const scramble = (word) => {
      const words = word.split(" ");
      if (words.length == 1) {
        let newWord = word;
        if (word.length != 1) while (newWord == word) newWord = word.split("").sort(() => Math.random() - 0.5).join("");
        return newWord;
      }
      return word.split(" ").map(v => scramble(v)).join(" ");
    }

    let shuffled = anagramWord;
    while (shuffled == anagramWord) shuffled = scramble(shuffled);

    const canvas = Canvas.createCanvas(200, 100);
    const context = canvas.getContext('2d');

    context.font = "48px Retrcade";
    const measuredScrambledWord = context.measureText(shuffled);

    canvas.width = (measuredScrambledWord.actualBoundingBoxLeft + measuredScrambledWord.actualBoundingBoxRight) + 40;
    canvas.height = (measuredScrambledWord.actualBoundingBoxDescent + measuredScrambledWord.actualBoundingBoxAscent) + 30;

    context.font = "48px Retrcade";
    context.fillText(shuffled, 20, canvas.height - 15, canvas.width - 20);

    let gameTime = 300_000
    const timeLeft = Date.now() + gameTime;

    const anagramEmbed = new ctx.EmbedBuilder()
      .setTitle("Anagram")
      .setDescription(`Unscramble the word. The word will be revealed in <t:${Math.floor(timeLeft / 1000)}:R>`)
      .setColor('#E6ACB6')
      .setImage(`attachment://word-${shuffled.replace(/ +/g, '')}.png`)

    const msg = await ctx.sendMsg({
      embeds: [anagramEmbed],
      files: [
        { name: `word-${shuffled.replace(/[^a-zA-Z0-9]/g, '')}.png`, attachment: canvas.toBuffer() },
      ],
      components: [
        {
          type: 1, components: [
            { type: 2, style: 2, custom_id: "anagram_openModel", label: "Guess" }
          ]
        }
      ]
    });

    let triesLeft = 3;
    const collector = msg.createMessageComponentCollector({
      filter: (inter) =>
        inter.user.id === ctx.interaction.user.id &&
        inter.customId.startsWith("anagram_"),
      time: gameTime,
    });

    collector.on("end", (_, reason) => {
      let embed2 = new ctx.EmbedBuilder()
        .setTitle("Yikes")
        .setColor("Red")
        .setDescription(`You ran out of time. The word was \`${anagramWord}\`.\n\nWant to play again? Run the command again!`);
      if (reason === "fail")
        embed2 = new ctx.EmbedBuilder()
          .setTitle("Yikes")
          .setColor("Red")
          .setDescription(`You ran out of guesses. The word was \`${anagramWord}\`.\n\nWant to play again? Run the command again!`);
      else if (reason === "success")
        embed2 = new ctx.EmbedBuilder()
          .setTitle("Nice job")
          .setColor("Green")
          .setDescription(`You successfully guessed the word \`${anagramWord}\` with ${triesLeft == 3 ? 'all ' : ''}${triesLeft} guess${triesLeft == 1 ? "" : "es"} and ${Math.round((timeLeft - Date.now()) / 1000) % 60 == 0 ? `${Math.round((timeLeft - Date.now()) / 1000)} seconds` : `${(Math.round((timeLeft - Date.now()) / 1000) / 60).toFixed(1)} minutes`} left`);

      anagramEmbed.setDescription("Unscramble the word.");
      msg.edit({ embeds: [anagramEmbed, embed2], components: [], });
    });

    collector.on('collect', (interaction) => {
      const modalId = `anagram_guessWord_${Date.now()}`;
      interaction.showModal({
        title: "Guess the Word",
        custom_id: modalId,
        components: [{
          type: 1,
          components: [
            {
              type: 4,
              style: 1,
              custom_id: "guess",
              label: "What do you think the word is?",
              placeholder: "word",
              min_length: 1,
              max_length: 100,
            }
          ]
        }
        ]
      })
      interaction.awaitModalSubmit({ filter: (mInter) => mInter.customId === modalId, time: timeLeft - Date.now() })
        .then((modalInteraction) => {
          const guessedWord = [...modalInteraction.fields.fields.values()][0].value;
          if (guessedWord != anagramWord) {
            triesLeft -= 1;
            modalInteraction.reply({ content: `Incorrect guess. You have ${triesLeft == 0 ? 'no' : triesLeft} guesses left.`, ephemeral: true })
            if (triesLeft <= 0) collector.stop("fail");
          } else if (guessedWord == anagramWord) {
            modalInteraction.deferUpdate();
            collector.stop("success");
          }
        }).catch(() => { })
    })
  }
};