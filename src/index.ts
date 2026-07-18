import { program } from "commander"
import * as zmq from "zeromq"
import { queueMessage } from "./router.js"
import { pb } from "./pb.js"

program
    .name("rc-rally-timing-connector-openstint")
    .usage("<decoder_key> [options]")
    .description("This program connects an openstint decoder to a rc-rally-timing instance")
    .argument("decoder_key", "The Decoder Access Key taken from your rc-rally-timing dashboard")
    .option("--decoder <address>", "The network address of the decoder", "localhost:5556")
    .option("--rc_rally_timing <url>", "The URL of the rc-rally-timing instance", "https://rc-rally-timing.com")
    .showHelpAfterError()

program.parse()
export const args = program.args
export const opts = program.opts()

async function main () {
    console.log("Posting to", opts.rc_rally_timing)
    pb.baseURL = opts.rc_rally_timing

    const socket = new zmq.Subscriber()
    console.log("Listening to Decoder from", opts.decoder)
    socket.connect("tcp://" + opts.decoder)
    socket.subscribe()

    for await (const msg of socket) {
        queueMessage(msg.toString())
    }
}

main()