module.exports = ({ msg, client }) => {
  class Roles {
    constructor() {
    	this.botId = client.user.id;
      this.getHighestRole = (userid) => {
        if (msg.channel.type == "dm") return 0;
        let highRole = { rank: -Infinity, data: null }
        
        for (const role of [...msg.guild.roles.cache]) {
          if (msg.guild.member(userid)._roles.includes(role[1].id) && highRole.rank < role[1].rawPosition) highRole = { rank: role[1].rawPosition, data: role };
        }
        return highRole.data[1];
      }
      this.getBotColor = this.getHighestRole(this.botId).color;
      this.getRoleRank = (userid) => {
        if (msg.channel.type == "dm") return 0;
        let highRole = -Infinity
        for (const role of [...msg.guild.roles.cache]) {
          if (msg.guild.member(userid)._roles.includes(role[1].id) && highRole < role[1].rawPosition) highRole = role[1].rawPosition;
        }
        return highRole;
      }
    }
  }
  return new Roles();  
}