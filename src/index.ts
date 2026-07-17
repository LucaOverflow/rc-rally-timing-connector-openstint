import * as zmq from "zeromq"
import { queueMessage } from "./router.js"

async function main () {
    const socket = new zmq.Subscriber()
    const decoderAddress = "tcp://rc-timing-start:5556"
    console.log("Listening to Decoder from", decoderAddress)
    socket.connect(decoderAddress)
    socket.subscribe()

    for await (const msg of socket) {
        queueMessage(msg.toString())
    }
}

main()