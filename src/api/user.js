import request from '@/utils/request'

export function ssoLogin() {
  const router = window.location.href.split("#")[1]
  window.location.href = window.location.origin + '/api/v1/auth/login?redirect=' + window.location.origin + '&router=' + router
}

export function getInfo(token) {
  return request({
    url: '/api/v1/auth/user',
    method: 'get',
    params: {token}
  })
}

export function ssoLogout() {
  window.location.href = window.location.origin + '/api/v1/auth/logout'
}
