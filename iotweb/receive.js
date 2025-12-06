const amqp = require('amqplib');

async function receive() {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    const queue = 'iot_queue';

    await channel.assertQueue(queue, { durable: false });

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

    // 消费消息
    channel.consume(queue, (msg) => {
      if (msg) {
        console.log(" [x] Received '%s'", msg.content.toString());
      }
    }, { noAck: true });
  } catch (error) {
    console.error(error);
  }
}

receive();
