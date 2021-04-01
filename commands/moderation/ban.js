module.exports = {
  description: "Bans a member in the server.",
  params: [
    {
      "name": "member",
      "type": [ "string", "member" ]
    },
    {
      "name": "time",
      "type": "number"
    }
  ],
  permissions: "BAN_MEMBERS",
  main: async ({ msg, type, params, getRoleRank, client, globalState }) => {
    let user;
    if (type(params.member) == "member") user = msg.mentions.member.first();
    else {
      user = client.users.cache.find(user => user.username == params.member.replace(/_/g , " "));
      if (!user) return msg.reply("This member is not in the server.");
      user = msg.guild.member(user.id)
    }
    if (client.user.id == user.id) return msg.reply("I cannot ban myself.");
    if (getRoleRank(client.user.id) <= getRoleRank(user.id)) return msg.reply("This user has higher or same permissions than I.");

    await user.send(`You were banned for ${params.time} hour${params.time > 1 ? "" : "s"}. I'll send you can invite link when you are able to join again.`)

    await user.ban({ days: params.time/24, reason: "Banned by bot command said by " + msg.author.username });
    globalState.bans.push(user.id);
    setTimeout(async () => {
      let invite = await msg.channel.createInvite({
        maxAge: 0,
        maxUses: 1,
        reason: `Invite link for banned member to join back.`
      })
      user.send(`Your good to go! Join back here: ${invite}.`)
    }, params.time * 1000 * 60 * 60)
    msg.reply(`Successfully banned <@!${user.id}>`);
  }
}