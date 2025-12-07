const { findUserByUsername } = require('../dao/userDao');

async function validateUserLogin(username, password) {
    try {
        const user = await findUserByUsername(username);
        if (user && user.password === password) {
            return { success: true, message: '登录成功！' };
        } else {
            return { success: false, message: '用户名或密码错误！' };
        }
    } catch (error) {
        console.error('验证用户登录时出错:', error);
        return { success: false, message: '服务器内部错误' };
    }
}

module.exports = {
    validateUserLogin
};