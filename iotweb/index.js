const express = require('express');
const app = express();
const db = require('./db');
/*
db.execPoolSQL('SELECT * FROM tel', [], (result) => { 
    console.log('查询返回结果...');
    console.log(result);
});*/

const bodyParser = require('body-parser');
const logger = require('morgan');
const amqp = require('amqplib');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('views'));

app.post('/login', (req, res) => {
    console.log(req.body);
    const result = {
        success: true,
        code: 200,
        message: '登录成功！',
        data: null
    };

    if(req.body.username === 'admin' && req.body.password === 'admin'){
        res.send(result);
    }
    else{
        result.success = false;
        result.message = '用户名或密码错误！';
        result.code = 401;
        res.send(result);
    }
    res.end();
});

app.get('/tel', (req, res) => { 
  console.log('查询参数:', req.query['device_id']);
  db.execPoolSQL('SELECT * FROM tel WHERE device_id = ? ORDER BY time DESC LIMIT 20', [req.query['device_id']], (result) => { 
    console.log('查询返回结果...');
    console.log(result);
    res.send(result);
    res.end();
  });
});

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

        const obj = JSON.parse(msg.content.toString());
        const sql = 'INSERT INTO tel (device_id, time, value) VALUES (?, ?, ?)';
        const params = [obj.device_id, obj.time, JSON.stringify(obj.value)];
        db.execPoolSQL(sql, params, (result) => { 
          if(result) { 
            console.log('插入成功');
          } else { 
            console.log('插入失败');
          }
        });
      }
    }, { noAck: true });
  } catch (error) {
    console.error(error);
  }
}

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
  receive();
});