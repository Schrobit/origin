const { findUserByUsername } = require('../dao/userDao');

/**
 * 验证用户登录
 * @param {string} username - 用户名
 * @param {string} password - 密码
 * @returns {Promise} 返回包含验证结果的Promise
 */
async function validateUserLogin(username, password) {
    try {
        // 从数据库中查找用户
        const user = await findUserByUsername(username);
        
        // 如果用户存在且密码匹配，则验证成功
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