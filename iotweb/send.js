const amqp = require('amqplib');

function formatDateTime(){
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
}

async function send() {
  try {
    // 1. 连接 RabbitMQ 服务器
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    const queue = 'iot_queue';
    // 2. 声明队列（若不存在则创建）
    await channel.assertQueue(queue, { durable: false });

    // 修改代码开始
    const device_id = 10;
    const time = formatDateTime();
    const value = {
        temp: Math.round(Math.random() * 40),
        humd: Math.round(Math.random() * 100),
    }
    const msg = JSON.stringify({ device_id, time, value });
    // 修改代码结束

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

setInterval(async () => {
  await send();
}, 5000);
