const express = require('express');
const { getDeviceTelemetry } = require('../services/telemetryService');

const router = express.Router();

router.get('/tel', async (req, res) => {
    try {
        console.log('查询参数:', req.query['device_id']);
        const result = await getDeviceTelemetry(req.query['device_id']);
        console.log('查询返回结果...');
        console.log(result);
        res.send(result);
    } catch (error) {
        console.error('获取遥测数据时出错:', error);
        res.status(500).send({ error: '获取遥测数据时出错' });
    }
});

module.exports = router;