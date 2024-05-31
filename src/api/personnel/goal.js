import request from "@/utils/request";

// 查询业绩目标列表
export function list(query) {
  return request({
    url: "/core/target/list",
    method: "get",
    params: query,
  });
}

// 查询业绩目标详细
export function getInfo(id) {
  return request({
    url: "/core/target/" + id,
    method: "get",
  });
}

// 新增业绩目标
export function add(data) {
  return request({
    url: "/core/target",
    method: "post",
    data: data,
  });
}

// 修改业绩目标
export function update(data) {
  return request({
    url: "/core/target",
    method: "put",
    data: data,
  });
}

// 删除业绩目标
export function del(id) {
  return request({
    url: "/core/target/" + id,
    method: "delete",
  });
}

// 业绩目标-编辑查询
export function listWeChat(query) {
  return request({
    url: "/core/target/listTargetDay",
    method: "get",
    params: query,
  });
}

// 业绩目标-编辑修改
export function editTarget(data) {
  return request({
    url: "/core/target/editTargetDay",
    method: "put",
    data: data,
  });
}

// 下载层级导入模板
export function importTemplate() {
  return request({
    url: "/core/target/importTemplate",
    method: "get",
    responseType: "blob",
  });
}

// 新版查询业绩目标列表
export function NewList(query) {
  return request({
    url: "/zw/targetMain/list",
    method: "get",
    params: query,
  });
}

// 新增业绩目标
export function NewAdd(data) {
  return request({
    url: "/zw/targetMain",
    method: "post",
    data: data,
  });
}

// 新版查询业绩目标详细
export function NewGetInfo(id) {
  return request({
    url: "/zw/targetMain/" + id,
    method: "get",
  });
}

// 新版业绩目标-编辑修改
export function NewUpdate(data) {
  return request({
    url: "/zw/targetMain",
    method: "put",
    data: data,
  });
}
// 删除业绩目标
export function NewDel(id) {
  return request({
    url: "/zw/targetMain/" + id,
    method: "delete",
  });
}
// 批量新增成员目标
export function NewInsertBatchMemberGoals(data) {
  return request({
    url: "/zw/targetMain/insertBatchMemberGoals",
    method: "post",
    data: data,
  });
}