const http = require('http');

// 准备要发送的数据
const data = JSON.stringify({
  device_id: 30,
  has_light: false,
  source: 'photo_sensor',
  threshold_percent: 20,
  ts: 1765090000000,
  visible_light_percent: 16.8162
});

// 配置请求选项
const options = {
  hostname: 'localhost',
  port: 8000,
  path: '/report',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

// 发送请求
const req = http.request(options, (res) => {
  console.log(`状态码: ${res.statusCode}`);

  res.on('data', (chunk) => {
    console.log(`响应主体: ${chunk}`);
  });

  res.on('end', () => {
    console.log('请求完成');
  });
});

req.on('error', (error) => {
  console.error(`请求遇到问题: ${error.message}`);
});

// 写入数据到请求主体
req.write(data);
req.end();