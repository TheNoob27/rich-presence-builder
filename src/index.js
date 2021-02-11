const { Client: RPCClient } = require("discord-rpc")
const { pid } = require("discord-rpc/src/util")
const { clientID, transport } = require("./constants")
const resolved = Symbol("resolved"), intervalSymbol = Symbol("interval")

let client = new RPCClient({ transport })
/** @type {Map<string, RPCClient>} */
const clients = new Map()

class RichPresence {
  constructor(data) {
    if (!data) data = {}
    if (typeof data.clientID === "string" && data.clientID !== clientID || data.transport && data.transport !== transport) {
      this._clientID = data.clientID || clientID
      this._client =
        clients.get(this._clientID) ||
        clients.set(this._clientID, new RPCClient({ transport: data.transport || transport })).get(this._clientID)
    }

    this.state = data.state || data.title
    this.details = data.details || data.description
    this.startTimestamp = data.startTimestamp || data.timestamp || data.timestamps && data.timestamps.start
    this.endTimestamp = data.endTimestamp || data.timestamps && data.timestamps.end
    this.largeImage = data.largeImage || data.image || data.assets && data.assets.large_image
    this.largeImageText = data.largeImageText || data.imageText || data.assets && data.assets.large_text
    this.smallImage = data.smallImage || data.assets && data.assets.small_image
    this.smallImageText = data.smallImageText || data.assets && data.assets.small_text
    this.buttons = data.buttons
      ? data.buttons.map((label, i) =>
          typeof label === "string" ? { label, url: data.metadata && data.metadata.button_urls[i] || "https://discord.com" } : label
        )
      : []
    if (!this.startTimestamp && typeof data.elapsedTime === "number") this.startTimestamp = Date.now() - data.elapsedTime
    if (!this.endTimestamp && typeof data.timeLeft === "number") this.endTimestamp = Date.now() + data.timeLeft
    
    this[resolved] = false
  }

  get client() {
    return this._client || client
  }

  set client(c) {
    if (c instanceof RPCClient) client = c
  }

  /** @typedef {string | ((presence?: RichPresence) => string | Promise<string>)} StringResolvable */

  /**
   * Add a button to this rich presence
   * @param {StringResolvable} label The name of the button
   * @param {StringResolvable} url The url which this button will open once pressed
   */
  addButton(label, url = "https://discord.com") {
    if (typeof label === "object") ({ label, url } = label)
    this.buttons.push({ label, url })
    return this
  }

  /**
   * Add a blank button to this rich presence
   * @param {StringResolvable} url The url which this button will open once pressed
   */
  addBlankButton(url) {
    this.buttons.push({ label: "\u200b", url })
    return this
  }

  /**
   * Clears the rich presence
   */
  clear() {
    [
      "state",
      "details",
      "startTimestamp",
      "endTimestamp",
      "largeImage",
      "largeImageText",
      "smallImage",
      "smallImageText",
    ].forEach(k => this[k] = undefined)
    this.buttons = []
    return this
  }

  /**
   * Set the state for this rich presence
   * @param {StringResolvable} text The text for the state
   */
  setState(text) {
    this.state = text
    return this
  }

  /**
   * Set the details for this rich presence
   * @param {StringResolvable} text The details
   */
  setDetails(text) {
    this.details = text
    return this
  }

  /**
   * Alias for setDetails
   * @param {StringResolvable} text 
   */
  setDescription(text) {
    return this.setDetails(text)
  }

  /**
   * Set the image for this rich presence, along with optional text that displays when the image is hovered over
   * @param {StringResolvable} icon The key of the image asset. This must be a valid icon added to your rich presence application.
   * @param {StringResolvable} text The hover over text
   */
  setLargeImage(icon, text) {
    if (icon) this.largeImage = icon
    if (text) this.largeImageText = text
    return this
  }

  /**
   * Set the small image for this rich presence, along with optional text that displays when the image is hovered over.
   * @param {StringResolvable} icon The key of the image asset. This must be a valid icon added to your rich presence application.
   * @param {StringResolvable} text The hover over text
   */
  setSmallImage(icon, text) {
    if (icon) this.smallImage = icon
    if (text) this.smallImageText = text
    return this
  }

  /**
   * Set the start timestamp for this rich presence
   * @param {number} time The timestamp
   */
  setStartTimestamp(time) {
    this.startTimestamp = time
    return this
  }

  /**
   * Alias for setStartTimestamp
   * @param {number} time
   */
  setTimestamp(time) {
    this.startTimestamp = time
    return this
  }

  /**
   * Shortcut for setStartTimestamp, sets the start timestamp to `time` seconds ago, so it says "`time` elapsed"
   * @param {number} time The time in seconds
   * @example
   * RichPresence.setElapsedTime(124) // 00:02:04 elapsed
   */
  setElapsedTime(time) {
    if (typeof time === "function") time = time(this)
    time *= 1000
    if (!isNaN(time) && time < Date.now()) this.startTimestamp = Math.min(Date.now() - time, 2147483647000)
    return this
  }

  /**
   * Set the end timestamp for this rich presence
   * @param {number} time The timestamp
   */
  setEndTimestamp(time) {
    this.endTimestamp = time
    return this
  }

  /**
   * Shortcut for setEndTimestamp, sets the end timestamp to `time` seconds left, so it says "`time` left"
   * @param {number} time The time in seconds
   * @example
   * RichPresence.setTimeLeft(124) // 00:02:04 left
   */
  setTimeLeft(time) {
    if (typeof time === "function") time = time(this)
    time *= 1000
    if (!isNaN(time)) this.endTimestamp = Math.min(Date.now() + time, 2147483647000)
    return this
  }

  /**
   * Sends this request to change your rich presence
   * @returns {RichPresence}
   */
  async go(interval = false) {
    if (this[intervalSymbol] && interval !== intervalSymbol) return true
    if (this[resolved]) return true

    if (!this.client.clientId)
      await this.client.connect(this._clientID || clientID).catch(e => {
        this.client.clientId = null
        throw e
      })

    let activity = await this.parseData()
    if (
      activity.state === undefined &&
      activity.details === undefined &&
      activity.assets === undefined &&
      activity.timestamps === undefined &&
      activity.buttons === undefined
    ) // blank activity
      activity = undefined

    const res = await this.client.request("SET_ACTIVITY", {
      pid: pid(),
      activity
    })
    if (interval === intervalSymbol) return res
    // this[resolved] = true

    const rp = new RichPresence(res)
    rp[resolved] = true
    rp.then = undefined
    rp.catch = undefined
    rp.interval = undefined
    return rp
  }

  async parseData() {
    const p = async (v, number) => {
      if (typeof v === "function") {
        v = v(this)
        if (v instanceof Promise) v = await v
      }
      if (number) {
        if (isNaN(v)) return
        return +v
      } else if (typeof v !== "undefined" && typeof v !== "string") v = String(v)
      return v
    }

    const d = {
      state: await p(this.state),
      details: await p(this.details),
      assets: this.largeImage || this.largeImageText || this.smallImage || this.smallImageText
        ? {
          large_image: await p(this.largeImage),
          large_text: await p(this.largeImageText),
          small_image: await p(this.smallImage),
          small_text: await p(this.smallImageText),
        }
        : undefined,
      timestamps: typeof this.startTimestamp === "number" || this.endTimestamp === "number"
        ? {
            start: await p(this.startTimestamp, true),
            end: await p(this.endTimestamp, true),
          }
        : undefined,
      buttons: this.buttons.length
        ? await Promise.all(this.buttons.map(async b => ({ label: await p(b.label), url: await p(b.url) })))
        : undefined
    }
    
    return d
  }

  then(resolve, reject) {
    return this.go().then(resolve, reject)
  }

  catch(reject) {
    return this.go().catch(reject)
  }

  interval(times, ms = 15000) {
    if (isNaN(times)) {
      this._interval = setInterval(() => this.go(intervalSymbol), Number(ms) || 15000)
    } else {
      let n = 0
      this._interval = setInterval(async () => {
        await this.go(intervalSymbol)
        if (++n === +times) {
          clearInterval(this._interval)
          this[resolved] = true
        }
      }, Number(ms) || 15000)
    }
    this[intervalSymbol] = true
    return this.go(intervalSymbol)
  }
}

module.exports = RichPresence