const db = require('../utils/dbUtil');

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