import request from "@/utils/request";

/**
 * 获取指令列表
 * @param deviceId 设备ID
 * @param typeId 指令类型ID
 * @param startTime 开始时间
 * @param endTime 结束时间
 * @param pageNum 当前页数
 * @param pageSize 每页显示条数
 * @returns {AxiosPromise}
 */
export function getCommands(deviceId, typeId, startTime, endTime, pageNum, pageSize) {
  return request({
    url: '/api/v1/devicemgr/commands',
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

export function getCommandTypes(pageNum = 1, pageSize = 100) {
  return request({
    url: '/api/v1/devicemgr/command/types',
    method: 'get',
    params: {
      pageNum: pageNum,
      pageSize: pageSize
    }
  })
}
