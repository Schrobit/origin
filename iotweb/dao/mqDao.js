const db = require('../utils/dbUtil');


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