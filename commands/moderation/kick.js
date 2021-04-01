module.exports = {
  description: "Kicks a members in the server.",
  params: {
    "name": "member",
    "type": [ "string", "member" ]
  },
  permissions: "KICK_MEMBERS",
  main: ({ msg, type, params, getRoleRank, client }) => {
    let user;
    if (type(params.member) == "member") user = msg.mentions.members.first();
    else {
      user = client.users.cache.find(user => user.username == params.member.replace(/_/g , " "));
      if (!user) return msg.reply("This member is not in the server.");
      user = msg.guild.member(user.id)
    }
    if (client.user.id == user.id) return msg.reply("I cannot kicj myself.");
    if (getRoleRank(client.user.id) <= getRoleRank(user.id)) return msg.reply("This user has higher or same permissions than I.");

    user.ban("Kicked by bot command said by " + msg.author.username );
    msg.reply(`Successfully Kicked <@!${user.id}>`);
  }
}