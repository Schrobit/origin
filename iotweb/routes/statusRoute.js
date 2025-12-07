const express = require('express');
const router = express.Router();
const { send } = require('../services/mqService');

router.post('/status', async (req, res) => {
  try {
    const { status, report } = req.body;
    
    if (!status && !report) {
      return res.status(400).json({ 
        success: false, 
        message: '必须提供 status 或 report 参数' 
      });
    }
    
    if (status && status !== 'on' && status !== 'off') {
      return res.status(400).json({ 
        success: false, 
        message: '状态参数无效，请提供 "on" 或 "off"' 
      });
    }
    
    if (report && report !== 'start' && report !== 'stop') {
      return res.status(400).json({ 
        success: false, 
        message: '报告参数无效，请提供 "start" 或 "stop"' 
      });
    }
    
    const messageObj = {};
    if (status) messageObj.status = status;
    if (report) messageObj.report = report;
    
    const result = await send(messageObj);
    
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