const { Client } = require('discord.js');
require('dotenv').config();
module.exports = class {
  constructor(token = process.env.BOT_TOKEN, {
    name = process.env.BOT_NAME,
    activity = process.env.BOT_ACTVITY,    
  } = {}) {
    this.client = new Client();
    this.history = [];
    this.listeners = {};
    this.name = name;
    this.activity = activity;
    this.env = process.env;
    this.client.on("ready", () => {
      if (this.name) {
        this.client.user.setUsername(this.name);
      }
      if (this.name) {
        this.client.user.setActivity(this.activity);
      }
      this.launchEvent("login")
    });
    this.client.on("message", msg => this.launchEvent("message", msg));
    this.client.on('guildMemberAdd', user => this.launchEvent("memberJoined", user));
    this.client.on('guildMemberRemove', user => this.launchEvent("memberLeft", user));
    if (token) this.login(token);
  }
  launchEvent(event, ...callbackParams) {
    this.history.push({ type: "event", name: event })
    for (const callback of this.listeners[event] || []) {
      if (typeof callback == "function") {
        callback.call(this, { callbackParams, ...this });
      } else if (typeof callback == "object") {
        switch (event) {
          case "message":
            onMessage({ callbackParams, ...callback, ...this })
            break;
        }
      }
    }
  }
  /**
   * Add lisetners to events
   * @param {string} event - Event to listen to.
   * @param {function|string} callback - The Function to run when the event takes place.
   * @param {object} default options - Runs default code with the chosen options.
   */
  on(event, callback, extra = {}) {
    this.listeners[event] = this.listeners[event] || [];
    if (callback) {
      if (typeof callback == "string") callback = require(callback);
      this.listeners[event].push(callback);
    }
    this.listeners[event].push(extra);
  }

  async login(token = process.env.BOT_TOKEN) {
    if (!token) return console.error(new Error("Bot Token expected"))
    await this.client.login(token);
  }
}

async function onMessage({
  commandsFolder = './commands/',
  prefix,
  prefixOnly,
  onMessedUpParams = "Looks like you messed up the parameters, take a look at this to help:",
  onMissingPerms = "You are missing permissions to do this command.",
  callbackParams, env, client, name
}) {
  const fs = require('fs');
  var commands = extraData = type = null;

  const [msg] = callbackParams
  const botLogo = env.BOT_LOGO;
  extraData = readFiles('./general/'); // TODO: Change
  type = extraData.type;
  commands = readFiles(commandsFolder, { command: true });

  if (!commands["help"]) {
    commands["help"] = {
      description: null,
      params: [
        {
          "name": "command",
          "type": "string",
          "optional": true
        },
        {
          "name": "extra",
          "type": "string",
          "optional": true
        }
      ],
      main: ({ msg, params, commands, createEmbed, type }) => {
        let funcHelp = type(params.command) == "string";
        const embed = createEmbed('General Help', `${name} Commands`, 'Help on the names of commands', { tidy: funcHelp });
        if (funcHelp) {
          if (type(commands[params.command]) == "undefined") return;

          let extraCommand = params.extra;
          if (type(extraCommand) == "string") {
            if (extraCommand == "commands") {
              console.log(commands[params.command].children)
              for (child of commands[params.command].children) {
                let name = child.name;
                for (param of child.params) name += ` (${param.optional ? "?" : ""}${param.name})`;
                embed.fields.push({
                  name,
                  value: child.description,
                  inline: true,
                });
                console.log(child)
              }
            }
          } else {
            let funcParams = commands[params.command].params;
            let aliases = commands[params.command].aliases || [];
            embed.title = "Command Help";
            let desc = `This command is ${params.command}`
            for (let param of funcParams) {
              desc += ` (${param.optional ? "?" : ""}${param.name})`;
              embed.fields.push({
                name: param.name,
                value: `type: ${param.type.join(", ")}${param.optional ? " | optional" : ""}`,
                inline: true,
              });
            }
            desc += aliases.length ? `
            
\`Aliases: ${aliases.join(", ")} \`` : ""
            embed.description = desc;
          }
        } else {
          let descCommands = Object.values(commands).filter(c => c.description);
          for (commandIndex in commands)
            if (descCommands.includes(commands[commandIndex])) {
            if (commands[commandIndex].parent) continue;
              embed.fields.push({
                name: commandIndex,
                value: commands[commandIndex].description,
                inline: true,
              });
            }
        }

        msg.channel.send({ embed });
      }
    }
    addFile(commands["help"])
  }
  for (c in commands) {
    for (a of commands[c].aliases || []) {
      commands[a] = { ...commands[c], parent: c };
    }
  }

  let msgBreakdown = msg.content.split(prefix);
  if (msgBreakdown[0].length || msgBreakdown.length == 1) return;
  if (!msgBreakdown[1]) return msg.reply(prefixOnly);
  let commandParts = msgBreakdown[1].split(' ');
  commandParts = commandParts.filter(t => t.length);
  let written = commands[commandParts[0]];
  if (!written) return;

  for (let i = 0, param = written.params[i]; i < written.params.length; i++, param = written.params[i]) {
    let validParam = false;
    for (paramtype of param.type) {
      if (paramtype == type(commandParts[i + 1]) || (type(commandParts[i + 1]) == "undefined" && param.optional)) validParam = true;
    }
    if (!validParam || commandParts.length - 1 > written.params.length) {
      msg.reply(onMessedUpParams);
      const parentCommand = written.parent || commandParts[0];
      written = commands.help;
      commandParts = ["help", parentCommand];
    }
  }

  if (msg.channel.type != "dm") {
    let missingPerms = [];
    //console.log(msg.member.permissions.toArray());
    for (perm of written.permissions) {
      if (!msg.member.permissions.toArray().includes(perm)) missingPerms.push(perm);
    }
    if (missingPerms.length) return msg.reply(`${onMissingPerms}. Permissions missing: ${missingPerms.join(", ")}`);
  }

  commandParts.shift();

  let newParams = {};
  for (let i = 0; i < commandParts.length; i++) newParams[written.params[i].name] = commandParts[i]
  commandParts = newParams;

  written.main({ msg, params: commandParts, commands, client, ...extraData });

  function readFiles (path, { command = false, root = true } = {}) {
    let data = {};
    const files = fs.readdirSync(path);
    if (!root) {
      let filePath = path.split("/")[2];
      let rootFile = require(path + filePath);
      console.log(rootFile.type)
      if (rootFile.type === "module") {
        rootFile.children = [];
        for (file of files) {
          sendFile = require(path + file.split(".js")[0]);
          sendFile.name = file.split(".js")[0];
          addFile(sendFile);
          rootFile.children.push(sendFile);
        }
        return addFile(rootFile);
      };
    }
    for (file of files) {
      let fileName = file.split(".js")[0];
      if (fs.lstatSync(path + file).isDirectory()) 
        data = { ...data, ...readFiles(path + file + "/", { command, root: false }) }
      else {
        if (command) {
          let rootFile = require(path + fileName);
          if (!root) {
            if (rootFile.type === "hidden") continue;
          }
          data[fileName] = rootFile;
          addFile(data[fileName])
        } else {
          data = { ...data, ...require(path + fileName)({ msg, client, botLogo }) };
        }
      }
    }
    return data;
  }
}
function addFile (file) {
  file.params = type(file.params) == "undefined" ? [] : (type(file.params) == "object" ? [file.params] : file.params);
  file.params.forEach((param, i) => file.params[i].type = (type(param.type) == "undefined" ? [] : (type(param.type) == "string" ? [param.type] : param.type)));
  file.permissions = type(file.permissions) == "undefined" ? [] : (type(file.permissions) == "string" ? [file.permissions] : file.permissions);
}