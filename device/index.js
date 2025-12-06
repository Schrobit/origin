// 引入MQTT客户端库，用于与MQTT服务器通信
const mqtt = require('mqtt');
// 引入Express框架，用于创建HTTP服务
const express = require('express');
// 引入日志记录中间件
const logger = require('morgan');
// 引入请求体解析中间件
const bodyParser = require('body-parser');

// 创建MQTT客户端并连接到本地MQTT服务器
// 参数说明：
// - 'mqtt://localhost:1883': MQTT服务器地址和端口
// - username/password: 连接认证信息
const client = mqtt.connect('mqtt://localhost:1883', { username: 'u2', password: '1234' });

// 当MQTT客户端连接成功时执行的回调函数
// connect事件：当客户端成功连接到MQTT代理服务器时触发
client.on('connect', () => {
  // 订阅主题'v1/attr'，表示此设备关心该主题的消息
  // subscribe方法：订阅一个或多个主题，当这些主题有新消息时会收到通知
  client.subscribe(['v1/attr']);
  //setInterval(send, 5000);
});

// 设备状态变量，默认为关闭状态
let devStatus = 'off';

// 当MQTT客户端接收到消息时执行的回调函数
// message事件：当客户端从已订阅的主题接收到消息时触发
// 参数说明：
// - t: 接收到消息的主题(topic)
// - m: 接收到的消息内容(message)
client.on('message', (t, m) => {
    console.log(`Received on ${t}: ${m.toString()}`);
    // 将消息内容解析为JSON对象
    const obj = JSON.parse(m.toString());
    // 判断消息是否来自'v1/attr'主题
    if( t === 'v1/attr' ){
        // 更新设备状态为消息中指定的状态
        devStatus = obj.status;
    }
});

// 发送传感器数据的函数
// publish方法：向指定主题发布消息
function send(){
    // 设备ID标识
    const device_id = 10;
    // 获取当前时间戳
    const time = formatDateTime();
    // 生成模拟的温湿度数据
    const value = {
        temp: Math.round(Math.random() * 40),  // 温度：0-40摄氏度的随机整数
        humd: Math.round(Math.random() * 100), // 湿度：0-100%的随机整数
    }
    // 将数据封装成JSON格式
    const msg = JSON.stringify({ device_id, time, value });
    console.log('publish: ' + msg);
    // 向'v1/tel'主题发布消息
    // publish方法：向指定主题发送消息，订阅该主题的所有客户端都能收到这条消息
    client.publish('v1/tel', msg);
}

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

// 创建Express应用程序实例
const app = express();
// 使用日志中间件记录HTTP请求
app.use(logger('dev'));
// 使用body-parser中间件解析JSON格式的请求体
app.use(bodyParser.json());
// 使用body-parser中间件解析URL编码的请求体
app.use(bodyParser.urlencoded({ extended: false }));

// 定义GET请求路由 /status
// 当访问http://localhost:8000/status时会返回当前设备状态
app.get('/status', (req, res) => {
    console.log('Received status request');
    // 返回设备当前状态
    res.send(devStatus);
    res.end();
});

// 启动HTTP服务器监听8000端口
app.listen(8000, () => {
    console.log('Device listening on port 8000!')
    // 每隔3秒自动发送一次传感器数据
    setInterval(send, 3000);
});
