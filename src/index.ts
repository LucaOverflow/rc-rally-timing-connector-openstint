import * as zmq from "zeromq"
import { queueMessage } from "./router.js"
import { decoderAddress } from "./params.js"

async function main () {
    const socket = new zmq.Subscriber()
    console.log("Listening to Decoder from", decoderAddress)
    socket.connect(decoderAddress)
    socket.subscribe()

    for await (const msg of socket) {
        queueMessage(msg.toString())
    }
}

main()