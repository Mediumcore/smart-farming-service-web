import request from '@/utils/request'

/**
 * 获取设备连接记录
 * @param pageNum 当前页数
 * @param pageSize 每页显示数量
 * @returns {AxiosPromise}
 */
export function getDeviceRecords(pageNum, pageSize) {
  return request({
    url: '/api/v1/devicemgr/devices/records',
    method: 'get',
    params: {
      pageNum: pageNum,
      pageSize: pageSize
    }
  })
}

/**
 * 获取设备列表
 * @param pageNum 当前页数
 * @param pageSize 每页显示数量
 * @param deviceName 设备名称
 * @param deviceType 设备类型
 * @returns {AxiosPromise}
 */
export function getDevices(pageNum, pageSize, deviceName, deviceType) {
  return request({
    url: '/api/v1/devicemgr/devices',
    method: 'get',
    params: {
      pageNum: pageNum,
      pageSize: pageSize,
      deviceName: deviceName,
      deviceType: deviceType
    }
  })
}

/**
 * 添加设备
 * @param name 设备名称
 * @param desc 设备描述
 * @param type 设备类型
 * @returns {AxiosPromise}
 */
export function addDevice(name, desc, type) {
  return request({
    url: '/api/v1/devicemgr/devices',
    method: 'post',
    params: {
      name: name,
      description: desc,
      type: type
    }
  })
}

/**
 * 修改设备
 * @param deviceId 设备ID
 * @param name 设备名称
 * @param desc 设备描述
 * @param type 设备类型
 * @returns {AxiosPromise}
 */
export function editDevice(deviceId, name, desc, type) {
  return request({
    url: '/api/v1/devicemgr/devices/' + deviceId,
    method: 'put',
    params: {
      name: name,
      description: desc,
      type: type
    }
  })
}

/**
 * 删除设备
 * @param deviceId 设备ID
 * @returns {AxiosPromise}
 */
export function removeDevice(deviceId) {
  return request({
    url: '/api/v1/devicemgr/devices/' + deviceId,
    method: 'delete'
  })
}

/**
 * 获取设备类型列表
 * @param pageNum 页数
 * @param pageSize 每页显示条数
 * @returns {AxiosPromise}
 */
export function getDeviceTypes(pageNum = 1, pageSize = 100) {
  return request({
    url: '/api/v1/devicemgr/types',
    method: 'get',
    params: {
      pageNum: pageNum,
      pageSize: pageSize
    }
  })
}

/**
 * 获取设备访问凭证
 * @param deviceId 设备ID
 * @returns {AxiosPromise}
 */
export function getDeviceCertificate(deviceId) {
  return request({
    url: '/api/v1/devicemgr/devices/' + deviceId + '/certificate',
    method: 'get'
  })
}
