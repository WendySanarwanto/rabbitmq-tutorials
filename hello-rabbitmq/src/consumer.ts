import { Channel, Connection } from "amqplib/callback_api";
import AmqService from "./amq-service";

const RABBIT_MQ_HOST = `amqp://localhost`;
const QUEUE_NAME = `rabbit-hole1`;

// -- Main Program -- //
async function main() {
    const amq = new AmqService(RABBIT_MQ_HOST, QUEUE_NAME);
    const connection: Connection = await amq.connect(RABBIT_MQ_HOST);
    connection.createChannel((err, channel: Channel) => {
        channel.assertQueue(QUEUE_NAME, {durable: false});
        channel.consume(QUEUE_NAME, (message) => {
            // tslint:disable-next-line:no-console
            console.log(` [X] Received the message: "${message.content}"`);
        }, { noAck: true});
    });
}

// tslint:disable-next-line:no-console
main().catch((err) => console.log(`Error: `, err));
