const http = require('http');

// 发送多条光线传感器数据，模拟不同的光照条件
const lightDataSamples = [
  {
    device_id: 30,
    has_light: true,
    source: 'photo_sensor',
    threshold_percent: 20,
    visible_light_percent: 75.5,
    ts: Date.now()
  },
  {
    device_id: 30,
    has_light: true,
    source: 'photo_sensor',
    threshold_percent: 20,
    visible_light_percent: 82.3,
    ts: Date.now() + 1000
  },
  {
    device_id: 30,
    has_light: true,
    source: 'photo_sensor',
    threshold_percent: 20,
    visible_light_percent: 68.7,
    ts: Date.now() + 2000
  },
  {
    device_id: 30,
    has_light: false,
    source: 'photo_sensor',
    threshold_percent: 20,
    visible_light_percent: 5.2,
    ts: Date.now() + 3000
  },
  {
    device_id: 30,
    has_light: false,
    source: 'photo_sensor',
    threshold_percent: 20,
    visible_light_percent: 2.1,
    ts: Date.now() + 4000
  }
];

function sendLightData(data, index) {
  if (index >= data.length) {
    console.log('所有数据发送完成');
    return;
  }

  const jsonData = JSON.stringify(data[index]);
  
  const options = {
    hostname: 'localhost',
    port: 8000,
    path: '/report',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': jsonData.length
    }
  };

  const req = http.request(options, (res) => {
    console.log(`状态码: ${res.statusCode}`);
    console.log(`已发送数据: ${JSON.stringify(data[index])}`);
    
    res.on('data', (chunk) => {
      console.log(`响应主体: ${chunk}`);
    });

    res.on('end', () => {
      console.log(`数据 ${index + 1} 发送完成\n`);
      // 间隔1秒发送下一条数据
      setTimeout(() => {
        sendLightData(data, index + 1);
      }, 1000);
    });
  });

  req.on('error', (error) => {
    console.error(`请求遇到问题: ${error.message}`);
  });

  req.write(jsonData);
  req.end();
}

console.log('开始发送光线传感器数据...');
sendLightData(lightDataSamples, 0);