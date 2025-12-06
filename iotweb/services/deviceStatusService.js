const deviceStatusDao = require('../dao/deviceStatusDao');

/**
 * 保存设备状态到数据库
 * @param {number} deviceId - 设备ID
 * @param {string} status - 设备状态 ('on' 或 'off')
 */
async function saveDeviceStatus(deviceId, status) {
  try {
    // 验证状态参数
    if (status !== 'on' && status !== 'off') {
      throw new Error('状态参数无效，请提供 "on" 或 "off"');
    }

    // 准备数据对象
    const data = {
      device_id: deviceId,
      status: status
    };

    // 使用DAO层插入数据
    const result = await deviceStatusDao.insertDeviceStatus(data);
    console.log(result.message);
    return result;
  } catch (error) {
    console.error('保存设备状态错误:', error.message);
    throw error;
  }
}

/**
 * 获取指定设备的最新状态
 * @param {number} deviceId - 设备ID
 */
async function getLatestDeviceStatus(deviceId) {
  try {
    const status = await deviceStatusDao.getLatestDeviceStatus(deviceId);
    return status;
  } catch (error) {
    console.error('获取设备状态错误:', error.message);
    throw error;
  }
}

module.exports = {
  saveDeviceStatus,
  getLatestDeviceStatus
};