// 引入MQTT客户端库，用于与MQTT服务器通信
const mqtt = require('mqtt');
// 引入AMQP库，用于与RabbitMQ消息队列通信
const amqp = require('amqplib');

// 创建MQTT客户端并连接到本地MQTT服务器
// 参数说明：
// - 'mqtt://localhost:1883': MQTT服务器地址和端口
// - username/password: 连接认证信息
const client = mqtt.connect('mqtt://localhost:1883', { username: 'u2', password: '1234' });
// 连接状态标志，表示MQTT客户端是否已连接
let connected = false;

// 当MQTT客户端连接成功时执行的回调函数
// connect事件：当客户端成功连接到MQTT代理服务器时触发
client.on('connect', () => {
  // 设置连接状态为已连接
  connected = true;
  // 订阅主题'v1/tel'，表示此网关关心设备上传的数据
  // subscribe方法：订阅一个或多个主题，当这些主题有新消息时会收到通知
  client.subscribe(['v1/tel']);
  console.log('Connected to MQTT broker');
});

// 当MQTT客户端接收到消息时执行的回调函数
// message事件：当客户端从已订阅的主题接收到消息时触发
// 参数说明：
// - t: 接收到消息的主题(topic)
// - m: 接收到的消息内容(message)
client.on('message', (t, m) => {
    console.log(`Received on ${t}: ${m.toString()}`)
    // 判断消息是否来自'v1/tel'主题（设备上传的数据）
    if( t === 'v1/tel' ){
        // 调用send函数将消息转发到RabbitMQ
        send(m.toString());
    }
});


// 异步函数：将MQTT消息发送到RabbitMQ队列
// 参数msg: 从MQTT接收到的消息内容
async function send(msg) {
  try {
    // 1. 连接 RabbitMQ 服务器
    const connection = await amqp.connect('amqp://localhost');
    // 创建通道用于消息传递
    const channel = await connection.createChannel();

    // 定义队列名称
    const queue = 'iot_queue';
    //const msg = 'Hello RabbitMQ from Node.js!';

    // 2. 声明队列（若不存在则创建）
    // assertQueue方法确保队列存在，如果不存在则创建
    // durable: false表示队列不持久化，服务器重启后会丢失
    await channel.assertQueue(queue, { durable: false });

    // 3. 发送消息到队列
    // sendToQueue方法将消息发送到指定队列
    // Buffer.from(msg)将字符串转换为Buffer格式
    channel.sendToQueue(queue, Buffer.from(msg));
    console.log(" [x] Sent '%s'", msg);

    // 4. 关闭连接
    // 使用setTimeout延迟关闭连接，确保消息发送完成
    setTimeout(() => {
      connection.close();
      //process.exit(0);
    }, 500);
  } catch (error) {
    // 错误处理：输出错误信息到控制台
    console.error(error);
  }
}

// 异步函数：从RabbitMQ接收控制指令并转发到MQTT
async function receive() {
  try {
    // 连接RabbitMQ服务器
    const connection = await amqp.connect('amqp://localhost');
    // 创建通道用于消息传递
    const channel = await connection.createChannel();

    // 定义接收控制指令的队列名称
    const queue = 'DOWN_QUEUE';

    // 声明队列（若不存在则创建）
    await channel.assertQueue(queue, { durable: false });

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

    // 消费消息（从队列中获取消息）
    // consume方法用于从队列中消费消息
    // 参数说明：
    // - queue: 要消费的队列名称
    // - 回调函数: 处理接收到的消息
    // - { noAck: true }: 自动确认消息，不需要手动确认
    channel.consume(queue, (msg) => {
      if (msg) {
        console.log(" [x] Received '%s'", msg.content.toString());
        // 检查MQTT客户端是否已连接
        if(connected){
            // 将控制指令通过MQTT发布到'v1/attr'主题
            // 设备会订阅这个主题来接收控制指令
            client.publish('v1/attr', msg.content.toString());
        } 
      }
    }, { noAck: true });
  } catch (error) {
    // 错误处理：输出错误信息到控制台
    console.error(error);
  }
}

// 启动RabbitMQ消息消费者，开始监听控制指令
receive();