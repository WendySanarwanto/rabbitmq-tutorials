import { Channel, connect, Connection } from "amqplib/callback_api";
import { promisify } from "util";

export default class AmqService {
  constructor(private amqHost: string, private queueName: string) {}

  /**
   * Connect to rabbit_mq server
   * @param amq_host The amqp url of the Rabbit MQ server
   */
  public connect(amqHost: string): Promise <Connection> {
    return new Promise<Connection>((resolve, reject) => {
      connect(amqHost, (err, amqConnectiton: Connection) => {
        if (err) { reject(err); }
        console.log(`Connection is established.`);
        resolve(amqConnectiton);
      });
    });
  }

  /**
   * Send string message into Rabbit MQ
   * @param rawData String data to send.
   */
  public sendMessage(rawData: string, connection: Connection) {
    const queueName = this.queueName;
    return new Promise((resolve) => {
      console.log(`Sending data...`);
      const createChannel = promisify(connection.createChannel);
      connection.createChannel((err, channel: Channel) => {
        channel.assertQueue(queueName, {durable: false});
        const data: Buffer = new Buffer(rawData, "utf-8");
        channel.sendToQueue(queueName, data);
        const messageLog = ` [x] Sent ${rawData}`;
        console.log(messageLog);
        resolve();
      });
    });
  }
}
