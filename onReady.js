const fs = require('fs');
module.exports = async ({ client, env }) => {
  let json = JSON.parse(fs.readFileSync("./data.json", 'utf8'));
  for (server of client.guilds.cache.array()) {
    if (!json[server.id]) {
      json[server.id] = {};
    }
  }
  //   client.api.applications(client.user.id).guilds(server.id).commands.post({
  //     data: {
  //       name: "hello",
  //       description: "hello world command"
  //       // possible options here e.g. options: [{...}]
  //     }
  //   });
  // }

  client.user.setActivity(env.BOT_ACTVITY);
  client.user.setUsername(env.BOT_NAME);
  fs.writeFile('./data.json', JSON.stringify(json), () => {});
  const setLogo = (timeout = 0) => {
    setTimeout(() => {
      client.user.setAvatar(env.BOT_LOGO).catch(err => {
        setLogo(1000);
      })
    }, timeout)
  }
  setLogo();

  // client.ws.on('INTERACTION_CREATE', async interaction => {
  //   const command = interaction.data.name.toLowerCase();
  //   const args = interaction.data.options;

  //   if (command === 'hello') { 
  //     client.api.interactions(interaction.id, interaction.token).callback.post({
  //     data: {
  //         type: 4,
  //         data: {
  //           content: "hello world!!!"
  //         }
  //       }
  //     })
  //   }
  // });
}