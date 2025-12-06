const mqtt = require('mqtt');
const amqp = require('amqplib');

const client = mqtt.connect('mqtt://localhost:1883', { username: 'u2', password: '1234' });
client.on('connect', () => {
  client.subscribe(['v1/attr', 'v1/tel']);
});

client.on('message', (t, m) => {
    console.log(`Received on ${t}: ${m.toString()}`)
    if( t === 'v1/tel' ){
        send(m.toString());
    }
});


async function send(msg) {
  try {
    // 1. 连接 RabbitMQ 服务器
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    const queue = 'iot_queue';
    //const msg = 'Hello RabbitMQ from Node.js!';

    // 2. 声明队列（若不存在则创建）
    await channel.assertQueue(queue, { durable: false });

    // 3. 发送消息到队列
    channel.sendToQueue(queue, Buffer.from(msg));
    console.log(" [x] Sent '%s'", msg);

    // 4. 关闭连接
    setTimeout(() => {
      connection.close();
      //process.exit(0);
    }, 500);
  } catch (error) {
    console.error(error);
  }
}

