import request from '@/utils/request'

export function issueBinding(controllerDeviceId, operationDeviceId) {
  return request({
    url: '/api/v1/operating/device/' + controllerDeviceId + '/binds',
    method: 'post',
    params: {
      targetId: operationDeviceId,
    }
  })
}

/**
 * 获取设备详情
 * @param deviceId
 * @returns {AxiosPromise}
 */
export function getDeviceDetail(deviceId) {
  return request({
    url: '/api/v1/operating/device/' + deviceId + '/detail',
    method: 'get',
  })
}

export function issueCommand(targetId, type, body) {
  const data = new FormData()
  data.append('type', type)
  data.append('body', body)
  return request({
    url: '/api/v1/operating/command/' + targetId,
    method: 'post',
data
  })
}
