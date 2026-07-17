import { format } from "node:util"

let messageQueue: string[] = []
setInterval(trySendMessageToServer, 1000)

export function queueMessage (msg: string) {
    const timestamp = new Date()
    const timestampString = format("%i-%i-%i %i:%i:%i",
        timestamp.getFullYear(),
        timestamp.getMonth(),
        timestamp.getDate(),
        timestamp.getHours(),
        timestamp.getMinutes(),
        timestamp.getSeconds()
    )
    console.log("\x1b[90m%s\x1b[0m", timestampString, "\t", msg.toString())

    messageQueue.push(msg)
}

function trySendMessageToServer () {
    // TODO
}