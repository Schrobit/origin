const express = require('express');
const router = express.Router();
const { send } = require('../services/mqService');

/**
 * POST /status 路由
 * 接收设备状态(on/off)并发送到MQ
 */
router.post('/status', async (req, res) => {
  try {
    // 从请求体中获取状态
    const { status } = req.body;
    
    // 验证状态参数
    if (!status || (status !== 'on' && status !== 'off')) {
      return res.status(400).json({ 
        success: false, 
        message: '状态参数无效，请提供 "on" 或 "off"' 
      });
    }
    
    // 调用MQ服务发送状态
    const result = await send(status);
    
    // 返回结果
    res.json({
      success: result.success,
      message: result.message
    });
  } catch (error) {
    console.error('状态路由错误:', error);
    res.status(500).json({ 
      success: false, 
      message: '服务器内部错误' 
    });
  }
});

module.exports = router;