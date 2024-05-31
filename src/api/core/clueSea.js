import request from "@/utils/request";

// 查询线索公海列表
export function listClueSea(query) {
  return request({
    url: "/zw/clueSea/list",
    method: "get",
    params: query,
  });
}

// 查询线索公海详细
export function getClueSea(id) {
  return request({
    url: "/zw/clueSea/" + id,
    method: "get",
  });
}

// 新增线索公海
export function addClueSea(data) {
  return request({
    url: "/zw/clueSea",
    method: "post",
    data: data,
  });
}

// 修改线索公海
export function updateClueSea(data) {
  return request({
    url: "/zw/clueSea",
    method: "put",
    data: data,
  });
}

// 删除线索公海
export function delClueSea(id) {
  return request({
    url: "/zw/clueSea/" + id,
    method: "delete",
  });
}

// 下载线索公海导入模板
export function importTemplate() {
  return request({
    url: "/zw/clueSea/importTemplate",
    method: "get",
    responseType: "blob",
  });
}

// 线索公海-领取
export function receive(params) {
  return request({
    url: "/zw/clueSea/clueSeaTake",
    method: "PUT",
    data: params,
  });
}

// 弹窗
export function getPopup(archiveId) {
  return request({
    url: "/zw/clueSea/clueSeaPopup/" + archiveId,
    method: "GET",
  });
}

// 客户公海转为线索
export function convertCustomer(data) {
  return request({
    url: "/zw/clueSea/convertClue",
    method: "PUT",
    data: data,
  });
}

// 线索资源-放回公海
export function putBack(data) {
  return request({
    url: "/zw/clueSea/putBackSea",
    method: "PUT",
    data: data,
  });
}
// 线索资源-分配
export function allotResource(data) {
  return request({
    url: "/zw/clueResourceSea/allotResource",
    method: "PUT",
    data: data,
  });
}
// 线索公海-跟进
export function followUp(data) {
  return request({
    url: "/zw/clueSea/followUp",
    method: "POST",
    data: data,
  });
}

/**
 * 反馈意见
 * @param {*} data
 * @returns
 */
export function seaHistory(data) {
  return request({
    url: "/zw/seaHistory",
    method: "POST",
    data: data,
  });
}
