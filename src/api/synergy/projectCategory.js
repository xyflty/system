import request from '@/utils/request'

// 查询协同项目分类列表
export function listProjectCategory(query) {
  return request({
    url: '/xt/projectCategory/list',
    method: 'get',
    params: query
  })
}

// 查询协同项目分类详细
export function getProjectCategory(id) {
  return request({
    url: '/xt/projectCategory/' + id,
    method: 'get'
  })
}

// 新增协同项目分类
export function addProjectCategory(data) {
  return request({
    url: '/xt/projectCategory',
    method: 'post',
    data: data
  })
}

// 修改协同项目分类
export function updateProjectCategory(data) {
  return request({
    url: '/xt/projectCategory',
    method: 'put',
    data: data
  })
}

// 删除协同项目分类
export function delProjectCategory(id) {
  return request({
    url: '/xt/projectCategory/' + id,
    method: 'delete'
  })
}


// 财务对接项目绑定
// 查询财务对接项目绑定协同列表
export function financialProjectCategoryList(query) {
  return request({
    url: '/xt/financialProjectCategory/list',
    method: 'get',
    params: query
  })
}

// 新增协同项目分类
export function addFinancialProjectCategory(data) {
  return request({
    url: '/xt/financialProjectCategory',
    method: 'post',
    data: data
  })
}

// 删除协同项目分类
export function delFinancialProjectCategory(id) {
  return request({
    url: '/xt/financialProjectCategory/' + id,
    method: 'delete'
  })
}

// 查询协同项目分类详细
export function getFinancialProjectCategory(id) {
  return request({
    url: '/xt/financialProjectCategory/' + id,
    method: 'get'
  })
}

// 修改协同项目分类
export function editFinancialProjectCategory(data) {
  return request({
    url: '/xt/financialProjectCategory',
    method: 'put',
    data: data
  })
}