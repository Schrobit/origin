const { getTelemetryByDeviceId } = require('../dao/telemetryDao');

/**
 * 获取设备的遥测数据
 * @param {string} deviceId - 设备ID
 * @returns {Promise} 返回包含遥测数据的Promise
 */
async function getDeviceTelemetry(deviceId) {
    try {
        // 从数据库中获取遥测数据
        const telemetryData = await getTelemetryByDeviceId(deviceId);
        return telemetryData;
    } catch (error) {
        console.error('获取遥测数据时出错:', error);
        throw error;
    }
}

module.exports = {
    getDeviceTelemetry
};