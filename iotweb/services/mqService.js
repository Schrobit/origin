const amqp = require('amqplib');
const mqDao = require('../dao/mqDao');
const { saveDeviceStatus } = require('./deviceStatusService');

/**
 * 接收MQ消息并存储到数据库
 */
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
          // 使用DAO层插入数据
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

/**
 * 发送设备状态到MQ
 * @param {string} status - 设备状态 ('on' 或 'off')
 */
async function send(status) {
  try {
    // 创建连接和通道
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    // 定义队列
    const queue = 'DOWN_QUEUE';
    
    // 声明队列
    await channel.assertQueue(queue, { durable: false });
    
    // 发送消息
    const message = JSON.stringify({ status: status, timestamp: new Date().toISOString() });
    channel.sendToQueue(queue, Buffer.from(message));
    
    console.log(" [x] Sent '%s'", message);
    
    // 保存状态到数据库 (设备ID为30的灯)
    try {
      await saveDeviceStatus(30, status);
    } catch (dbError) {
      console.error('数据库保存状态错误:', dbError.message);
    }
    
    // 关闭连接
    setTimeout(() => {
      connection.close();
    }, 500);
    
    return { success: true, message: '状态发送成功' };
  } catch (error) {
    console.error('MQ发送错误:', error);
    return { success: false, message: '状态发送失败: ' + error.message };
  }
}

module.exports = { receive, send };