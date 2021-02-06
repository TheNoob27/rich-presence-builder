declare module "discord-rpc-builder" {
  import { Client } from "discord-rpc"

  type StringResolvable = string | ((presence?: RichPresence) => string | Promise<string>)
  type TimeResolvable = number | Date | ((presence?: RichPresence) => number | Date | Promise<number | Date>)

  interface PresenceData {
    clientID?: string,
    state: StringResolvable,
    details: StringResolvable,
    startTimestamp: number | Date,
    elapsedTimestamp?: number,
    endTimestamp: number | Date,
    largeImageText: StringResolvable,
    smallImageText: StringResolvable,
    buttons: Button[]
  }

  interface Button {
    label: StringResolvable,
    url: StringResolvable
  }

  export = class RichPresence {
    constructor(data: PresenceData)
    private _clientID?: string
    private _client?: Client
    readonly client: Client

    state: string
    details: string
    startTimestamp: number | Date
    endTimestamp: number | Date
    largeImageText: string
    smallImageText: string
    buttons: Button[]

    /**
     * Add a button to this rich presence
     * @param label The name of the button
     * @param url The url which this button will open once pressed
     */
    addButton(label: StringResolvable, url?: StringResolvable): this
    /**
     * Add a blank button to this rich presence
     * @param url The url which this button will open once pressed
     */
    addBlankButton(url?: StringResolvable): this
    /**
     * Clears the rich presence
     */
    clear(): this
    /**
     * Set the state for this rich presence
     * @param text The text for the state
     */
    setState(text: StringResolvable): this
    /**
     * Set the details for this rich presence
     * @param text The details
     */
    setDetails(text: StringResolvable): this
    /**
     * Alias for setDetails
     * @param text
     */
    setDescription(text: StringResolvable): this
    /**
     * Set the image for this rich presence, along with optional text that displays when the image is hovered over
     * @param icon The key of the image asset. This must be a valid icon added to your rich presence application.
     * @param text The hover over text
     */
    setLargeImage(icon: StringResolvable, text: StringResolvable): this
    /**
     * Set the small image for this rich presence, along with optional text that displays when the image is hovered over.
     * @param icon The key of the image asset. This must be a valid icon added to your rich presence application.
     * @param text The hover over text
     */
    setSmallImage(icon: StringResolvable, text: StringResolvable): this
    /**
     * Set the start timestamp for this rich presence
     * @param time The timestamp
     */
    setStartTimestamp(time: TimeResolvable): this
    /**
     * Alias for setStartTimestamp
     * @param {number} time
     */
    setTimestamp(time: TimeResolvable): this
    /**
     * Shortcut for setStartTimestamp, sets the start timestamp to `time` seconds ago, so it says "(`time`) elapsed"
     * @param time The time in seconds
     * @example
     * RichPresence.setElapsedTime(124) // 00:02:04 elapsed
     */
    setElapsedTime(time: TimeResolvable): this
    /**
     * Set the end timestamp for this rich presence
     * @param time The timestamp
     */
    setEndTimestamp(time: TimeResolvable): this
    /**
     * Shortcut for setEndTimestamp, sets the end timestamp to `time` seconds left, so it says "(`time`) left"
     * @param time The time in seconds
     * @example
     * RichPresence.setTimeLeft(124) // 00:02:04 left
     */
    setTimeLeft(time: TimeResolvable): this
    go(): Promise<RichPresence>

    // then<R>(resolve: (res: RichPresence) => R): R
    // then<R, RJ>(resolve: (res: RichPresence) => R, reject: (error: Error) => RJ): R | RJ
    // catch<RJ>(reject: (error: Error) => RJ): RJ
    interval(ms: number, times?: number): this
  }
}