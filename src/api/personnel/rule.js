import request from "@/utils/request";

// =================================== 第一级 ===================================
// 查询晋升规则 主列表
export function listPromoteMain(query) {
  return request({
    url: "/core/promoteMain/list",
    method: "get",
    params: query,
  });
}

// 查询晋升规则 主详细
export function getPromoteMain(id) {
  return request({
    url: "/core/promoteMain/" + id,
    method: "get",
  });
}

// 新增晋升规则 主
export function addPromoteMain(data) {
  return request({
    url: "/core/promoteMain",
    method: "post",
    data: data,
  });
}

// 修改晋升规则 主
export function updatePromoteMain(data) {
  return request({
    url: "/core/promoteMain",
    method: "put",
    data: data,
  });
}

// 删除晋升规则 主
export function delPromoteMain(id) {
  return request({
    url: "/core/promoteMain/" + id,
    method: "delete",
  });
}

// =================================== 第二级 ===================================

// 查询晋升规则 层级列表
export function listPromoteLevel(query) {
  return request({
    url: "/core/promoteLevel/list",
    method: "get",
    params: query,
  });
}

// 查询晋升规则 层级详细
export function getPromoteLevel(id) {
  return request({
    url: "/core/promoteLevel/" + id,
    method: "get",
  });
}

// 新增晋升规则 层级
export function addPromoteLevel(data) {
  return request({
    url: "/core/promoteLevel",
    method: "post",
    data: data,
  });
}

// 修改晋升规则 层级
export function updatePromoteLevel(data) {
  return request({
    url: "/core/promoteLevel",
    method: "put",
    data: data,
  });
}

// 删除晋升规则 层级
export function delPromoteLevel(id) {
  return request({
    url: "/core/promoteLevel/" + id,
    method: "delete",
  });
}

// =================================== 第三级 ===================================

// 查询晋升规则 规则详情列表
export function listPromoteRule(query) {
  return request({
    url: "/core/promoteRule/list",
    method: "get",
    params: query,
  });
}

// 查询晋升规则 规则详情详细
export function getPromoteRule(id) {
  return request({
    url: "/core/promoteRule/" + id,
    method: "get",
  });
}

// 新增晋升规则 规则详情
export function addPromoteRule(data) {
  return request({
    url: "/core/promoteRule",
    method: "post",
    data: data,
  });
}

// 修改晋升规则 规则详情
export function updatePromoteRule(data) {
  return request({
    url: "/core/promoteRule",
    method: "put",
    data: data,
  });
}

// 删除晋升规则 规则详情
export function delPromoteRule(id) {
  return request({
    url: "/core/promoteRule/" + id,
    method: "delete",
  });
}