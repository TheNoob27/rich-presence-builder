# Rich Presence Builder
Easily build and create a Discord Rich Presence that can also be dynamic and update on an interval, with buttons!

# Step 1
Install rich-presence-builder: `npm i rich-presence-builder`
### And that's it! You can now start making cool presences with ease
![Example](https://cdn.discordapp.com/attachments/654956539869659136/807644285989552168/unknown.png)

# How to use
First create a file and import the package.
```js
const RichPresence = require("rich-presence-builder")
```
Then, create a new rich presence and add what you need. Use `.go()` when complete
```js
new RichPresence()
  .setState("I am in a state of panic")
  .setDetails("Made with rich-presence-builder")
  .addButton("discord home", "https://discord.com")
  .go()
```
After running the file, it should look something like this:

![Example](https://cdn.discordapp.com/attachments/654956539869659136/807647255661379594/unknown.png)

- You can also use `then`/`await`:
```js
await new RichPresence().setDetails("I have awaited B)")
// or
new RichPresence()
  .setDetails("then what?")
  .then(rpc => console.log(rpc.details)) // "then what?"
```

- Everything can also be dynamic:
```js
const rp = new RichPresence()
await rp.setState(() => `${Date.now().toLocaleTimeString()}: staying alive`)
```


- You can use intervals:
```js
// updates every 15s
await new RichPresence().setState(() => `${Date.now().toLocaleTimeString()}: staying alive`).interval()
```
even with a limit
```js
// stops updating after 10 updates
await new RichPresence().setState(() => `${Date.now().toLocaleTimeString()}: staying alive`).interval(10)
```


- You can use timestamps:
```js
await new RichPresence().setElapsedTime(60) // 00:01:00 elapsed
// or
await new RichPresence().setTimeLeft(60) // 00:01:00 left

// or you can do it the old-fashioned way:
await new RichPresence().setStartTimestamp(Date.now()) // 00:00:00 elapsed
// or
await new RichPresence().setEndTimestamp(Date.now()) // 00:00:00 left
```


- You can even reuse the same RichPresence:
```js
const rp = new RichPresence
await rp.setState("saying hello")
// soon
await rp.setState("saying goodbye").setDetails("it's time to go").addButton("say goodbye")
```


- You can also clear your presence if you need to:
```js
await rp.clear()
// clear() doesn't have to remove your presence, it can also be used to clear data:
await rp.clear().setState("clean presence")
```

# Images
If you wish to use images, please use your own application:
```js
new RichPresence({ clientID: "383226320970055681" })
  .setLargeImage("js", "JavaScript")
  .setSmallImage("python", "Python")
  .go()
```
You can create an application on [Discord's Developer Portal](https://discord.com/developers/applications).