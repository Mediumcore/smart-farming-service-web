import request from "@/utils/request";

/**
 * 获取事件列表
 * @param deviceId 设备ID
 * @param typeId 事件类型ID
 * @param startTime 开始时间
 * @param endTime 结束时间
 * @param pageNum 当前页数
 * @param pageSize 每页显示条数
 * @returns {AxiosPromise}
 */
export function getEvents(deviceId, typeId, startTime, endTime, pageNum, pageSize) {
  return request({
    url: '/api/v1/devicemgr/events',
    method: 'get',
    params: {
      deviceId: deviceId,
      typeId: typeId,
      startTime: startTime,
      endTime: endTime,
      pageNum: pageNum,
      pageSize: pageSize
    }
  })
}

export function getEventTypes(pageNum = 1, pageSize = 100) {
  return request({
    url: '/api/v1/devicemgr/event/types',
    method: 'get',
    params: {
      pageNum: pageNum,
      pageSize: pageSize
    }
  })
}

export function getLastEvent(deviceId, eventTyp) {
  return request({
    url: '/api/v1/operating/device/' + deviceId + '/event/' + eventTyp + '/last',
    method: 'get'
  })
}
