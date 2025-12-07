const amqp = require('amqplib');
const mqDao = require('../dao/mqDao');
const { saveDeviceStatus } = require('./deviceStatusService');


async function receive() {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    const queue = 'iot_queue';

    await channel.assertQueue(queue, { durable: false });

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

    // 消费消息
    channel.consume(queue, async (msg) => {
      if (msg) {
        console.log(" [x] Received '%s'", msg.content.toString());

        const obj = JSON.parse(msg.content.toString());
        
        try {
          
          const result = await mqDao.insertDeviceData(obj);
          console.log(result.message);
        } catch (error) {
          console.error('数据库插入错误:', error.message);
        }
      }
    }, { noAck: true });
  } catch (error) {
    console.error('MQ接收错误:', error);
  }
}

async function send(message) {
  try {
    // 如果传入的是字符串（为了兼容旧代码），则转换为对象
    if (typeof message === 'string') {
      message = { status: message };
    }
    
    // 创建连接和通道
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    // 定义队列
    const queue = 'DOWN_QUEUE';
    
    // 声明队列
    await channel.assertQueue(queue, { durable: false });
    
    // 发送消息
    const messageStr = JSON.stringify(message);
    channel.sendToQueue(queue, Buffer.from(messageStr));
    
    console.log(" [x] Sent '%s'", messageStr);
    
    // 如果消息包含status字段，则保存状态到数据库 (设备ID为30的灯)
    if (message.status) {
      try {
        await saveDeviceStatus(30, message.status);
      } catch (dbError) {
        console.error('数据库保存状态错误:', dbError.message);
      }
    }
    
    // 关闭连接
    setTimeout(() => {
      connection.close();
    }, 500);
    
    return { success: true, message: '指令发送成功' };
  } catch (error) {
    console.error('MQ发送错误:', error);
    return { success: false, message: '指令发送失败: ' + error.message };
  }
}

module.exports = { receive, send };