import { Channel, Connection } from "amqplib/callback_api";
import AmqService from "./amq-service";

const RABBIT_MQ_HOST = `amqp://localhost`;
const QUEUE_NAME = `rabbit-hole2`;

// -- Main Program -- //
async function main() {
    const amq = new AmqService(RABBIT_MQ_HOST, QUEUE_NAME);
    const connection: Connection = await amq.connect(RABBIT_MQ_HOST);
    connection.createChannel((err, channel: Channel) => {
        channel.assertQueue(QUEUE_NAME, {durable: true});

        // Don't dispatch a new message to a worker until it has processed and acknowledged the previous one. 
        // Instead, it will dispatch it to the next worker that is not still busy.
        channel.prefetch(1);

        channel.consume(QUEUE_NAME, (message) => {
            const parsedMessage = message.content.toString();
            const secs = parsedMessage.split(".").length - 1;

            console.log(` [X] Received the message: "${parsedMessage}"`);
            setTimeout(() => {
                console.log(` [x] Processing message is Done. Process time: ${secs} second(s)`);
              }, secs * 1000);
        }, { noAck: false});
    });
}

// tslint:disable-next-line:no-console
main().catch((err) => console.log(`Error: `, err));
