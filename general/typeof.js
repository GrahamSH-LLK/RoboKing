module.exports = ({ msg, client, botLogo }) => {
  class Typeof {
    constructor() {
      this.type = (val) => {
      return (typeof val == "string" ? (isNaN(val) ? (val.startsWith("<@!") ? "member" : typeof val) : "number") : (typeof val == "object" ? (val == null ? "null" : (Array.isArray(val) ? "array" : typeof val)) : typeof val));
    }
    }
  }
  return new Typeof();
}
