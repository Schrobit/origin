const { getTelemetryByDeviceId } = require('../dao/telemetryDao');


async function getDeviceTelemetry(deviceId) {
    try {
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