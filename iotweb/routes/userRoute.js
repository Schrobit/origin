const express = require('express');
const { validateUserLogin } = require('../services/userService');

const router = express.Router();

router.post('/login', async (req, res) => {
    console.log(req.body);
    
    try {
        // 调用服务层验证用户登录
        const result = await validateUserLogin(req.body.username, req.body.password);
        
        // 构建响应对象
        const response = {
            success: result.success,
            code: result.success ? 200 : 401,
            message: result.message,
            data: null
        };
        
        res.send(response);
    } catch (error) {
        console.error('处理登录请求时出错:', error);
        res.status(500).send({
            success: false,
            code: 500,
            message: '服务器内部错误',
            data: null
        });
    }
    
    res.end();
});

module.exports = router;