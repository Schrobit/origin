const { execPoolSQL } = require('../utils/dbUtil');

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