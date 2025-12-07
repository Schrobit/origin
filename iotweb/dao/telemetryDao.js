const { execPoolSQL } = require('../utils/dbUtil');

function getTelemetryByDeviceId(deviceId) {
    return new Promise((resolve, reject) => {
        let sql, params;
        if (deviceId) {
            // 如果提供了设备ID，则查询特定设备的数据
            sql = 'SELECT * FROM tel WHERE device_id = ? ORDER BY time DESC LIMIT 20';
            params = [deviceId];
        } else {
            // 如果没有提供设备ID，则查询所有设备的数据
            sql = 'SELECT * FROM tel ORDER BY time DESC LIMIT 150';
            params = [];
        }
        
        execPoolSQL(sql, params, (result) => {
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