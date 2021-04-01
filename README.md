# My Discord Bot
Welcome to my discord bot's source code...

### Table of contents
* Files/Folders
* How it works
* Todo

### Files/Folders
* [index.js](#index.js)
* onReady.js
* onMessage.js
* README.md
* commands
  * help.js
  * moderation
    * moderation.js (ROOT)
    * ban.js
    * kick.js
  * ping.js
  * purge.js
* general
  * embed.js
  * roles.js
  * typeof.js

### How it works
TODO: UPDATE THIS AS I AM CREATING MY OWN NODE MODULE. EXSITING INFO IS MOSTLY CORRECT.

index.js is where everything starts. It's called by [package.json](#package.json). Then, index.js starts by initisializing a couple of things... the express app and the discord client).
* Express App
&nbsp;&nbsp;&nbsp;&nbsp;↳ It a website called https://Discord-Bot.thecolaber.repl.co going directly to the site will lead you to `Cannot GET /` but if you notice on line 7, I do declare a path for the site which I called, `keepalive`. Reason being, repl puts repls to sleep after a couple of minutes, so I create a uptime robot that will visit that site every five minutes, which in turn, keeps my repl alive so my bot is online. You visiting it is not very useful so currently, the purpose of this express app is just to use it for an uptime robot.
* Discord Client
&nbsp;&nbsp;&nbsp;&nbsp;↳ Code from lines 9 - 17 manage my discord bot, as well as all the other files and folders within this repl. The great thing about the system I'm using is that I can seperate each command in a sperate file... you can see all the files in the commands folder. I use require statement to access these files which is why their are `module.exports = ...`. The onMessage.js file runs when a message is sent (`require` location: index.js) and `require`s all of the file from the commands and general folders using the fs node package. Speeking of the general folder, these files are used got using general commands throught the repl. A very popularly used file is embed.js which simply makes it easier to create embeds. I have also onReady.js (`require` location: index.js), that just runs when the discord bot logs in. It sets the image of the bot, username and more. Lastly, we have data.json. data.json will be used to store data between different servers. For example, wheather or not the server has been setup, what's it's messaging channel, and much more. This system is not 100% and still has a lot of places to be inproved, but it is much better than just cramming all your code in one file...

### Todo
* linkify unlinkified files
* setup command
* unban command
* reaction roles command (https://stackoverflow.com/questions/48033935/using-emotes-to-give-roles-discord-js)
* create emojis commands (https://discord.js.org/#/docs/main/stable/class/GuildEmojiManager?scrollTo=create)
* have something on my site
* slash commands

© **2020-2021 TheColaber**