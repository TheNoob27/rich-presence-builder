(async (RichPresence) => {
  // testing async
  const rp = new RichPresence()
  await rp
    .setState(Math.random)
    .setDescription("lets, gooooooo")
    .addButton("not a rick roll", "https://media.discordapp.net/attachments/654956539869659136/804843475107053598/video0.mp4")
})
(require("../src"))
// (require("rich-presence-builder"))