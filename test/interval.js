const RichPresence = require("../src")
let label = ""
new RichPresence({ clientID: "655390915325591629" })
  .setDetails("hey it's me again :)")
  .setState(() => Math.random() > 0.4 ? "i'm making a very cool starboard bot haha" : "go gift me nitro or something")
  .setLargeImage("logo", "Starboard")
  .setStartTimestamp(Date.now())
  .addButton(() => {
    const r = [
      "Patreon",
      "Starboard Bot Invite",
      "top.gg",
      "Vote",
      "cheese",
      "not a rick roll",
      "you are looking quite good today",
      "\u200b",
      "Random Link"
    ]
    return label = r[Math.floor(Math.random() * r.length)]
  }, () => {
    const l = {
      Patreon: "https://patreon.com/TheNoob27",
      "Starboard Bot Invite":
        "https://discord.com/oauth2/authorize?client_id=655390915325591629&scope=bot&permissions=26688",
      "top.gg": "https://top.gg/bot/655390915325591629",
      Vote: "https://top.gg/bot/655390915325591629/vote",
      _rr: "https://media.discordapp.net/attachments/654956539869659136/804843475107053598/video0.mp4",
      random() {
        const a = Object.values(this).filter(f => typeof f === "string")
        return a[Math.floor(Math.random() * a.length)]
      },
    }
    return l[label] || l.random()
  })
  .addButton("Made w/ rich-presence-builder <3", "https://github.com/TheNoob27/rich-presence-builder") //"https://npmjs.com/package/rich-presence-builder")
  .interval()
console.log("Created a RichPresence on an interval!")