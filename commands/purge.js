module.exports = {
  description: "Remove last messages in channel. Best when purging lastest messages.",
  params: {
    "name": "count",
    "type": "number"
  },
  permissions: "MANAGE_MESSAGES",
  main: async ({ msg, params }) => {
    console.log(`Purging ${params.count} message(s)`)
    await msg.delete();
    for(; params.count > 0;) {
      await msg.channel.bulkDelete(Math.min(100, params.count)).catch(async err => {
        if (err.code == 50034) {
          let messages = await msg.channel.messages.fetch()
          console.log(param.count, messages.array().slice(0, Number(params.count)).length)
          for (message of messages.array().slice(0, params.count)) {
            message.delete();
          }
          params.count = 100
        }
        params.count-= 100
      });
      params.count-= 100
    }
  }
}