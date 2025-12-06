const db = require('../utils/dbUtil');

/**
 * 插入设备数据到数据库
 * @param {Object} data - 设备数据对象
 * @param {number} data.device_id - 设备ID
 * @param {string} data.time - 时间戳
 * @param {Object} data.value - 数据值（温度和湿度）
 * @returns {Promise} 返回插入结果的Promise
 */
function insertDeviceData(data) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO tel (device_id, time, value) VALUES (?, ?, ?)';
        const params = [data.device_id, data.time, JSON.stringify(data.value)];
        db.execPoolSQL(sql, params, (result) => {
            if (result) {
                resolve({ success: true, message: '插入成功' });
            } else {
                reject(new Error('插入失败'));
            }
        });
    });
}

module.exports = {
    insertDeviceData
};