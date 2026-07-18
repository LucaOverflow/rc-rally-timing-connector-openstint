import { format } from "node:util"
import { pb } from "./pb.js"
import { decoderId } from "./params.js"
import type { ClientResponseError } from "pocketbase"

interface messageFormatS {
    type: string,
    timestamp: string,
    noisePower: string,
    dcOffsetMagnitutee: string,
    framesReceived: string,
    framesProcessed: string
}

interface messageFormatP {
    type: string,
    timestamp: string,
    transponderType: string,
    transponderId: string,
    rssi: string,
    hitCount: string,
    passDuration: string
}

interface messageFormatT {
    type: string,
    decoderTimestamp: string,
    transponderType: string,
    transponderId: string,
    transponderTimecode: string
}

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

    const msgFragments = msg.split(" ")
    switch(msgFragments[0]) {
        case "S":
            // Do nothing
            break;
        case "P":
            new MessageP({
                type: msgFragments[0],
                timestamp: msgFragments[1] || '',
                transponderType: msgFragments[2] || '',
                transponderId: msgFragments[3] || '',
                rssi: msgFragments[4] || '',
                hitCount: msgFragments[5] || '',
                passDuration: msgFragments[6] || ''
            })
            break;
        case "T":
            // Do nothing
            break;
    }
}

class MessageP {
    constructor (msgP: messageFormatP) {
        this.msg = msgP
        this.tryPostMessage()
    }

    private tryPostMessage () {
        pb.collection('passings').create({
            decoder: decoderId,
            timecode_ms: this.msg.timestamp,
            transponder: this.msg.transponderId,
            transponder_type: this.msg.transponderType,
            rssi: this.msg.rssi,
            hit_count: this.msg.hitCount
        })
            .catch((error: ClientResponseError) => {
                console.error("[Post Message Error]", error.message, error.status)
                if (error.status < 400 || error.status >= 500) {
                    setTimeout(() => { this.tryPostMessage() }, 1000 * this.retryDelayMultiplicator)
                    if (this.retryDelayMultiplicator < 60) {
                        this.retryDelayMultiplicator++
                    }
                }
            })
    }

    msg: messageFormatP
    retryDelayMultiplicator = 1
}