import request from "@/utils/request";

// 查询公共资源公海列表
export function listCommonResourceSea(query) {
  return request({
    url: "/zw/commonResourceSea/list",
    method: "get",
    params: query,
  });
}

// 查询公共资源公海详细
export function getCommonResourceSea(id) {
  return request({
    url: "/zw/commonResourceSea/" + id,
    method: "get",
  });
}

// 新增公共资源公海
export function addCommonResourceSea(data) {
  return request({
    url: "/zw/commonResourceSea",
    method: "post",
    data: data,
  });
}

// 修改公共资源公海
export function updateCommonResourceSea(data) {
  return request({
    url: "/zw/commonResourceSea",
    method: "put",
    data: data,
  });
}

// 删除公共资源公海
export function delCommonResourceSea(id) {
  return request({
    url: "/zw/commonResourceSea/" + id,
    method: "delete",
  });
}

// 下载公共资源库公海导入模板
export function importTemplate() {
  return request({
    url: "/zw/commonResourceSea/importTemplate",
    method: "get",
    responseType: "blob",
  });
}

// 公海详情
export function getDetail({ type, id }) {
  return request({
    url: `/zw/${type}/` + id,
    method: "GET",
  });
}

// 公共资源公海-领取
export function receive(params) {
  return request({
    url: "/zw/commonResourceSea/commonResourceSeaTake",
    method: "PUT",
    data: params,
  });
}

// 弹窗
export function getPopup(customerId) {
  return request({
    url: "/zw/commonResourceSea/commonResourceSeaPopup/" + customerId,
    method: "GET",
  });
}

// 公共资源转为线索
export function convertClue(data) {
  return request({
    url: "/zw/commonResourceSea/convertClue",
    method: "PUT",
    data: data,
  });
}

// 公共资源-放回公海
export function putBack(data) {
  return request({
    url: "/zw/commonResourceSea/putBackSea",
    method: "PUT",
    data: data,
  });
}

// 公共资源-分配
export function allotResource(data) {
  return request({
    url: "/zw/commonResourceSea/allotResource",
    method: "PUT",
    data: data,
  });
}

// 公共资源公海-跟进
export function followUp(data) {
  return request({
    url: "/zw/commonResourceSea/followUp",
    method: "POST",
    data: data,
  });
}
