import { connect, Connection } from "amqplib/callback_api";
import * as moment from "moment";
import AmqService from "./amq-service";

const RABBIT_MQ_HOST = `amqp://localhost`;
const QUEUE_NAME = `rabbit-hole2`;
const TIMESTAMP_FORMAT = "MMMM Do YYYY, hh:mm:ss a";

// -- Main Program -- //
async function main() {
    const amq = new AmqService(RABBIT_MQ_HOST, QUEUE_NAME);
    const message = process.argv.slice(2).join(" ") || "Hello White Rabbit ...";

    const connection: Connection = await amq.connect(RABBIT_MQ_HOST);

    const timestamp = moment().format(TIMESTAMP_FORMAT);
    const data = `'${message}' at ${timestamp}`;
    amq.sendMessage(data, connection, true);
}

main();
