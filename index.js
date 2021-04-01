/*
Welcome visiters/devs! This is my discord bot's source code.

- Start in README.md where it explains how everything works.
- Read my licenes in LICENSE

Thanks for visiting/helping!

© 2020-2021 TheColaber

https://discord.com/oauth2/authorize?client_id=785975271341424691&permissions=8&scope=applications.commands%20bot
*/

const DiscordBot = require('./DiscordBot');
const bot = new DiscordBot("RoboKing");
bot.login(); // Defaults to `process.env.BOT_TOKEN`
bot.on("message", "", {
  prefix: "r!",
  prefixOnly: "That's Me!"
});


(() => {
  const app = require('express')(),
  listener = app.listen(process.env.PORT || 3000, () => console.log(`Listening on port ${listener.address().port}`));

  app.get("/keepalive", (request, response) => response.send('Alive'));
})();