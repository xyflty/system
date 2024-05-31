import request from "@/utils/request";

// 查询客户公海列表
export function listCustomerSea(query) {
  return request({
    url: "/zw/customerSea/list",
    method: "get",
    params: query,
  });
}

// 查询客户公海详细
export function getCustomerSea(id) {
  return request({
    url: "/zw/customerSea/" + id,
    method: "get",
  });
}

// 新增客户公海
export function addCustomerSea(data) {
  return request({
    url: "/zw/customerSea",
    method: "post",
    data: data,
  });
}

// 修改客户公海
export function updateCustomerSea(data) {
  return request({
    url: "/zw/customerSea",
    method: "put",
    data: data,
  });
}

// 删除客户公海
export function delCustomerSea(id) {
  return request({
    url: "/zw/customerSea/" + id,
    method: "delete",
  });
}

// 下载客户公海导入模板
export function importTemplate() {
  return request({
    url: "/zw/customerSea/importTemplate",
    method: "get",
    responseType: "blob",
  });
}

// 客户公海-领取
export function receive(params) {
  return request({
    url: "/zw/customerSea/customerSeaTake",
    method: "PUT",
    data: params,
  });
}

// 弹窗
export function getPopup(archiveId) {
  return request({
    url: "/zw/customerSea/customerSeaPopup/" + archiveId,
    method: "GET",
  });
}

// 客户公海转为线索
export function convertClue(data) {
  return request({
    url: "/zw/customerSea/convertClue",
    method: "PUT",
    data: data,
  });
}

// 客户资源-放回公海
export function putBack(data) {
  return request({
    url: "/zw/customerSea/putBackSea",
    method: "PUT",
    data: data,
  });
}
// 客户资源-分配
export function allotResource(data) {
  return request({
    url: "/zw/customerSea/allotResource",
    method: "PUT",
    data: data,
  });
}
// 客户公海-跟进
export function followUp(data) {
  return request({
    url: "/zw/customerSea/followUp",
    method: "POST",
    data: data,
  });
}
