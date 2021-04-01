module.exports = {
  description: "See the listener speed of the bot",
  main: ({ msg, createEmbed }) => {
    const embed = createEmbed('', 'Pong', `:ping_pong: I'm ${new Date() - msg.createdTimestamp}ms off!`, { color: 0xeb4034, tidy: true });
    msg.channel.send({ embed });
  }
}