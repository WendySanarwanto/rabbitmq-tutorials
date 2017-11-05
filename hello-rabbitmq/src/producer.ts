import { connect, Connection } from "amqplib/callback_api";
import * as moment from "moment";
import AmqService from "./amq-service";

const RABBIT_MQ_HOST = `amqp://localhost`;
const QUEUE_NAME = `rabbit-hole1`;
const TIMESTAMP_FORMAT = "MMMM Do YYYY, hh:mm:ss a";

// -- Main Program -- //
async function main() {
    const amq = new AmqService(RABBIT_MQ_HOST, QUEUE_NAME);
    const message = "Hello White Rabbit!";

    const connection: Connection = await amq.connect(RABBIT_MQ_HOST);
    // Sending message each 3 seconds
    setInterval(() => {
        const timestamp = moment().format(TIMESTAMP_FORMAT);
        const data = `'${message}' at ${timestamp}`;
        amq.sendMessage(data, connection);
    }, 3000);
}

main();
