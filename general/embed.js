module.exports = ({ msg, client, botLogo }) => {
  class Embed {
    constructor() {
        this.createEmbed = (title, name, description, { color = extraData.getBotColor, tidy = false } = {}) => {
        let toSend = {
          color,
          title,
          author: {
            name,
            icon_url: botLogo,
          },
          description,
          thumbnail: {
            url: botLogo,
          },
          fields: [],
          timestamp: new Date(),
          footer: {
            text: title,
            icon_url: botLogo,
          },
        };
        if (tidy) {
          toSend.footer = {};
          toSend.thumbnail = {};
          toSend.timestamp = "";
        }
        return toSend;
      }
    }
  
  }
  return new Embed();
}
