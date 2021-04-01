module.exports = {
  description: "Bans a member in the server.",
  permissions: "ADMINISTRATOR",
  main: async ({ msg, type, params, getRoleRank, client, globalState }) => {
    if (msg.channel.id === '751206350133919787') {
    console.log('Clearing welcome')
    let messages = await msg.channel.messages.fetch()
    let length = messages.array().length - 1
    if (messages.array().length !== 1) {
    for(; length > 0;) {
      await msg.channel.bulkDelete(Math.min(100, length)).catch(async err => {
        if (err.code == 50034) {
          
          console.log(param.count, messages.array().slice(0, Number(length)).length)
          for (message of messages.array().slice(0, length)) {
            message.delete();
          }
          length = 100
        }
        length-= 100
      });
      length-= 100
    }
    }
    } else {
      msg.channel.send('Please use this command in #welcome')
    }
  }
}