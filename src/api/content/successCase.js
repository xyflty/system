import request from "@/utils/request";

// 查询成功案例列表
export function listSuccessCase(query) {
  return request({
    url: "/core/successCase/list",
    method: "get",
    params: query,
  });
}

// 查询成功案例详细
export function getSuccessCase(id) {
  return request({
    url: "/core/successCase/" + id,
    method: "get",
  });
}

// 新增成功案例
export function addSuccessCase(data) {
  return request({
    url: "/core/successCase",
    method: "post",
    data: data,
  });
}

// 修改成功案例
export function updateSuccessCase(data) {
  return request({
    url: "/core/successCase",
    method: "put",
    data: data,
  });
}

// 删除成功案例
export function delSuccessCase(id) {
  return request({
    url: "/core/successCase/" + id,
    method: "delete",
  });
}

// 导出成功案例
export function exportSuccessCase(query) {
  return request({
    url: "/core/successCase/export",
    method: "post",
    params: query,
    responseType: "blob",
  });
}

// 下载人员导入模板
export function importTemplate() {
  return request({
    url: "/core/successCase/importTemplate",
    method: "get",
    responseType: "blob",
  });
}
