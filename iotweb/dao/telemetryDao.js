const { execPoolSQL } = require('../utils/dbUtil');

/**
 * 根据设备ID获取遥测数据
 * @param {string} deviceId - 设备ID
 * @returns {Promise} 返回包含遥测数据的Promise
 */
function getTelemetryByDeviceId(deviceId) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM tel WHERE device_id = ? ORDER BY time DESC LIMIT 20';
        execPoolSQL(sql, [deviceId], (result) => {
            if (result) {
                resolve(result);
            } else {
                resolve([]);
            }
        });
    });
}

module.exports = {
    getTelemetryByDeviceId
};