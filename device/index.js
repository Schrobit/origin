const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost:1883', { 
username: 'u1', password: '1234' });

client.on('connect', () => {
  //client.publish('v1/attr', 'Node.js u1 hello');

    // 修改代码结束
    console.log('Connected!');
  setInterval(send, 5000);
});

function send(){
    // 修改代码开始
    const device_id = 10;
    const time = formatDateTime();
    const value = {
        temp: Math.round(Math.random() * 40),
        humd: Math.round(Math.random() * 100),
    }
    const msg = JSON.stringify({ device_id, time, value });
    console.log('publish: ' + msg);
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

