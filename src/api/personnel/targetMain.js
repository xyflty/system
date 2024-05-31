import request from '@/utils/request'

// 查询业绩目标列表
export function listTargetMain(query) {
  return request({
    url: '/core/targetMain/list',
    method: 'get',
    params: query
  })
}

// 查询业绩目标详细
export function getTargetMain(id) {
  return request({
    url: '/core/targetMain/' + id,
    method: 'get'
  })
}

// 新增业绩目标
export function addTargetMain(data) {
  return request({
    url: '/core/targetMain',
    method: 'post',
    data: data
  })
}

// 修改业绩目标
export function updateTargetMain(data) {
  return request({
    url: '/core/targetMain',
    method: 'put',
    data: data
  })
}

// 删除业绩目标
export function delTargetMain(id) {
  return request({
    url: '/core/targetMain/' + id,
    method: 'delete'
  })
}
