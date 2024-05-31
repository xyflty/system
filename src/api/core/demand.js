import request from "@/utils/request";

// 查询挖需记录列表
export function listDemand(query) {
  return request({
    url: "/zw/demand/list",
    method: "get",
    params: query,
  });
}

// 查询挖需记录详细
export function getDemand(id) {
  return request({
    url: "/zw/demand/" + id,
    method: "get",
  });
}

// 新增挖需记录
export function addDemand(data) {
  return request({
    url: "/zw/demand",
    method: "post",
    data: data,
  });
}

// 修改挖需记录
export function updateDemand(data) {
  return request({
    url: "/zw/demand",
    method: "put",
    data: data,
  });
}

// 删除挖需记录
export function delDemand(id) {
  return request({
    url: "/zw/demand/" + id,
    method: "delete",
  });
}

// 置顶或取消置顶
export function setTop(data) {
  return request({
    url: "/zw/demand/setTop",
    method: "put",
    data: data,
  });
}

// 转为商机
export function convert(data) {
  return request({
    url: "/zw/demand/convert",
    method: "put",
    data: data,
  });
}

// 新增跟进
export function followUp(data) {
  return request({
    url: "/zw/demand/followUp",
    method: "post",
    data: data,
  });
}

// 下载导入模板
export function importTemplate() {
  return request({
    url: "/zw/demand/importTemplate",
    method: "get",
    responseType: "blob",
  });
}

