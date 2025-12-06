const db = require('../utils/dbUtil');

/**
 * 插入设备状态到数据库
 * @param {Object} data - 设备状态对象
 * @param {number} data.device_id - 设备ID
 * @param {string} data.status - 设备状态 ('on' 或 'off')
 * @returns {Promise} 返回插入结果的Promise
 */
function insertDeviceStatus(data) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO device_status (device_id, status, timestamp) VALUES (?, ?, NOW())';
        const params = [data.device_id, data.status];
        db.execPoolSQL(sql, params, (result) => {
            if (result) {
                resolve({ success: true, message: '设备状态插入成功' });
            } else {
                reject(new Error('设备状态插入失败'));
            }
        });
    });
}

/**
 * 获取指定设备的最新状态
 * @param {number} deviceId - 设备ID
 * @returns {Promise} 返回设备状态的Promise
 */
function getLatestDeviceStatus(deviceId) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM device_status WHERE device_id = ? ORDER BY timestamp DESC LIMIT 1';
        const params = [deviceId];
        db.execPoolSQL(sql, params, (result) => {
            if (result && result.length > 0) {
                resolve(result[0]);
            } else {
                resolve(null);
            }
        });
    });
}

module.exports = {
    insertDeviceStatus,
    getLatestDeviceStatus
};