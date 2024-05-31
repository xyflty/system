import request from '@/utils/request'

// 查询跟进评论记录列表
export function listFollowUpComment(query) {
  return request({
    url: '/zw/followUpComment/list',
    method: 'get',
    params: query
  })
}

// 查询跟进评论记录详细
export function getFollowUpComment(id) {
  return request({
    url: '/zw/followUpComment/' + id,
    method: 'get'
  })
}

// 新增跟进评论记录
export function addFollowUpComment(data) {
  return request({
    url: '/zw/followUpComment',
    method: 'post',
    data: data
  })
}

// 修改跟进评论记录
export function updateFollowUpComment(data) {
  return request({
    url: '/zw/followUpComment',
    method: 'put',
    data: data
  })
}

// 删除跟进评论记录
export function delFollowUpComment(id) {
  return request({
    url: '/zw/followUpComment/' + id,
    method: 'delete'
  })
}
