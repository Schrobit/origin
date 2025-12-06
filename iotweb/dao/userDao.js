const { execPoolSQL } = require('../utils/dbUtil');

/**
 * 根据用户名查找用户信息
 * @param {string} username - 用户名
 * @returns {Promise} 返回包含用户信息的Promise
 */
function findUserByUsername(username) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM user WHERE username = ?';
        execPoolSQL(sql, [username], (result) => {
            if (result && result.length > 0) {
                resolve(result[0]);
            } else {
                resolve(null);
            }
        });
    });
}

module.exports = {
    findUserByUsername
};