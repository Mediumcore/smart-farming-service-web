import request from '@/utils/request'

export function overview() {
  return request({
    url: '/api/v1/devicemgr/overview',
    method: 'get',
    params: {}
  })
}
