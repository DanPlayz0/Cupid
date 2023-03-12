const Command = require("@structures/framework/Command");
const pickupLines = [
  "My love for you is like diarrhea, I just can't hold it in.",
  "I'm no photographer, but I can picture us together.",
  "Did you invent the airplane? Because you seem Wright for me.",
  "Do you believe in love at first sight, or should I walk by again?",
  "Aside from being sexy, what do you do for a living?",
  "Are you a cat? Cause you are purrrfect",
  "Your kids will be really pretty but 'Y' is silent.",
  "On a scale of 1 to 10, you are a 9, and I’m the 1 you need.",
  "Feel my shirt. Know what it’s made of? Boyfriend material.",
  "Are you http? because I'm ://  without you",
  "If you were a flower you’d be a damnnn-delion.",
  "Do you want to go to In-and-Out for burgers or just in-and-out of me?",
  "They say Disneyland is the happiest place on earth. Well apparently, no one has ever been standing next to you.",
  "We’re not socks, but I think we’d make a great pair.",
  "They say that kissing is a language of love, so would you mind starting a conversation with me?",
  "Are you lost ma’am? Because heaven is a long way from here.",
  "Call me country roads, cause I'mma take you home.",
  "I wish I was cross-eyed so I could see you twice.",
  "There’s only one thing I want to change about you, and that’s your last name.",
  "I’m lost. Can you give me directions to your heart?",
  "I'd like to do Astronomy, but instead of looking at the heavens I'd like to look at you.",
  "Did your licence get suspended for driving all these guys crazy?",
  "I'm glad I remembered to bring my library card. 'Cause I am totally checking you out!",
  "If I were a stop light, I’d turn red every time you passed by just so I could stare at you a little bit longer.",
  "Are your parents bakers? Cause you are a cutiepie",
  "Are you a time traveller coz I can see u in my future",
  "You’re so beautiful you made me forget my pickup line.",
  "You must be debt, because my interest in you is growing.",
  "Is your name Wi-Fi? Because I am really started to feel a connection.",
  "Did the sun come out or did you just smile at me?",
  "Hey, my name's Microsoft. Can I crash at your place tonight?",
  "[Why?] Because when I looked at you, I dropped mine.",
  "If nothing lasts forever, will you be my nothing",
  "Are you an elevator? Because I’ll go up and down on you.",
  "Are you a dictionary? Cause you’re adding meaning to my life.",
  "Do you have a tan or do you always like this hot?",
  "Are you Jewish? Cause you ISRAELI HOT.",
  "If looks could kill, you’d be a weapon of mass destruction.",
  "Do you know CPR? Because you are taking my breath away!",
  "If I had four quarters to give to the four prettiest girls in the world, you would have a dollar.",
  "Roses are red, Violets are fine. I'll be the 6, If you be the 9",
  "Are you my phone charger? Because without you, I’d die.",
  "Are you cryptocurrency? Coz I wanna hold you for so long.",
  "If kisses were raindrops, I'd give you showers and if hugs were minutes, I'd give you hours!",
  "Are you a magician? Because every time I look at you, everyone else disappears.",
  "Mario is red, Sonic is blue, will you be my player 2.",
  "Roses are red, I want you to remember. You are the reason, I lost no nut November.",
  "If I could rearrange the alphabet, I would put U and I together.",
  "Tired of being an adult? Then by my baby",
  "Not really into sunsets, but I would love to see you go down.",
  "I wasn't always religious. But I am now, because you're the answer to all my prayers.",
  "You are hotter than the bottom of my laptop.",
  "I was blinded by your beauty; I’m going to need your name and phone number for insurance purpose",
  "Do you have a map? I keep getting lost in your eyes.",
  "Can I follow you where you’re going right now? Because my parents always told me to follow my dreams.",
  "Like a broken pencil, life without you is pointless.",
  "Kiss me if I'm wrong, but you wanna kiss me, right?", // interesting
  "Kissme and kissyou are on a boat if kissyou falls off who remains on the boat?",
  "Are you sure you’re not tired? You’ve been running through my mind all day.",
  "Baby, if you were words on a page, you'd be fine print.",
  "Hi, how was heaven when you left it?",
  "I seem to have lost my phone number. Can I have yours?",
  "You must be a broom, ‘cause you just swept me off my feet.",
  "You are so hot, that the temperature itself broke the ice.",
  "Call me country roads, cause I'mma take you home.",
  "Do you have a name, or can I just call you mine?", // ah yes
  "You don’t need keys to drive me crazy.",
  "Is there an airport nearby or is it my heart taking off?",
  "Hey, you’re pretty and I’m cute.",
  "Was your dad a boxer? Because damn, you’re a knockout!",
  "Are you chocolate pudding? 'Cause i want to spoon you.",
  "Are you a cat because I’m feline a connection between us.",
  "I'm not drunk, I'm just intoxicated by YOU.",
  "Damn, I'm no weather man, but you can expect a couple inches tonight.",
  "You're so sweet, you'd put Hershey's out of business!",
  "Was your father a thief? Because someone stole the stars from the sky and put them in your eyes.",
  "Is your dad a terrorist? Cause you’re the bomb.",
  "Together we’d be Pretty Cute.",
  "Therapy is expensive so I watch you smile.", // favorite
  "Do you like Star Wars? Because Yoda only one for me!",
  "You must be made of cheese. Because you're looking Gouda tonight!",
  "Are you a camera? Because every time I see you I smile",
  "Is your name Google? Because you have everything I’ve been searching for.",
  "Can I borrow your cell phone? I want to call my mother and tell her I just met the girl of my dreams.",
  "Just took a DNA test. Turns out I'm 100% your type.",
  "Is this the Hogwarts Express? Because it feels like you and I are headed somewhere magical.",
  "Was that an earthquake, or did you just rock my world.",
  "If I asked you out on a date, would your answer be the same as your answer to this one?",
  "Are you my assignment? Cause I'm not doing you but I definitely should be",
  "Kiss me if I'm wrong. But dinosaurs still exist, right?",
  "i wanna c_ddle and k_ss. But u and i aren't together",
  "You must be a high test score. Because I want to take you home and show you to my mother.",
  "Screw the alphabet, cause U R A Q T.",
  "One a scale of 1 to 10, you are an 8. And I'm in 2 you.",
];

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      enabled: true,
      description: "Get a funny/cool/cool pickup-lines.",
      category: "Text",
      options: [
        {
          name: "line",
          description: "The pickup line number to show.",
          type: 4,
          required: false,
          min_value: 1,
          max_value: pickupLines.length,
        },
      ],
    });
  }

  async run(ctx) {
    const ideaNumber = ctx.args.getInteger('line') ?? (Math.floor(Math.random() * pickupLines.length) + 1);
    ctx.sendMsg(`**#${ideaNumber}:** ${pickupLines[ideaNumber - 1]}`)
  }
};