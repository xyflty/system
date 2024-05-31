import request from '@/utils/request'

// 查询ABC现场培训报名列表
export function listAbcTrainApply(query) {
  return request({
    url: '/core/abcTrainApply/list',
    method: 'get',
    params: query
  })
}

// 查询ABC现场培训报名详细
export function getAbcTrainApply(id) {
  return request({
    url: '/core/abcTrainApply/' + id,
    method: 'get'
  })
}

// 新增ABC现场培训报名
export function addAbcTrainApply(data) {
  return request({
    url: '/core/abcTrainApply',
    method: 'post',
    data: data
  })
}

// 修改ABC现场培训报名
export function updateAbcTrainApply(data) {
  return request({
    url: '/core/abcTrainApply',
    method: 'put',
    data: data
  })
}

// 删除ABC现场培训报名
export function delAbcTrainApply(id) {
  return request({
    url: '/core/abcTrainApply/' + id,
    method: 'delete'
  })
}

// 确认状态
export function coreAbcTrainApplyConfirm(id) {
  return request({
    url: '/core/abcTrainApply/confirm/' + id,
    method: 'get'
  })
}

// 签到
export function coreAbcTrainApplySingIn(id) {
  return request({
    url: '/core/abcTrainApply/singIn/' + id,
    method: 'get'
  })
}

export function getAbcTrainApplyFeedback(id) {
  return request({
    url: '/core/abcTrainApplyFeedback/' + id,
    method: 'get'
  })
}

export function addAbcTrainApplyFeedback(data) {
  return request({
    url: '/core/abcTrainApplyFeedback',
    method: 'post',
    data: data
  })
}