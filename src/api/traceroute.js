import request from '@/utils/request'

/**
 * 获取寻迹路线列表
 * @param name 路线名称
 * @param pageNum 当前页数
 * @param pageSize 每页显示条数
 * @returns {AxiosPromise}
 */
export function getTraceRoutes(name, pageNum, pageSize) {
  return request({
    url: '/api/v1/devicemgr/traceroute',
    method: 'get',
    params: {
      name: name,
      pageNum: pageNum,
      pageSize: pageSize
    }
  })
}

/**
 * 删除寻迹路线
 * @param routeId 路线ID
 * @returns {AxiosPromise}
 */
export function removeTraceRoute(routeId) {
  return request({
    url: '/api/v1/devicemgr/traceroute/' + routeId,
    method: 'delete',
  })
}

/**
 * 获取路线详情
 * @param routeId 路线ID
 * @returns {AxiosPromise}
 */
export function getTraceRouteDetail(routeId) {
  return request({
    url: '/api/v1/devicemgr/traceroute/' + routeId,
    method: 'get',
  })
}

/**
 * 新增或更新路线
 * @param data {}
 * @returns {AxiosPromise}
 */
export function saveTraceRoute(data) {
  return request({
    url: '/api/v1/devicemgr/traceroute/save',
    method: 'post',
    data
  })
}




