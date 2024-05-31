import request from "@/utils/request";

// 查询审批流程列表
export function listAudit(query) {
  return request({
    url: "/zw/audit/list",
    method: "get",
    params: query,
  });
}

// 查询审批流程详细
export function getAudit(id) {
  return request({
    url: "/zw/audit/" + id,
    method: "get",
  });
}

// 新增审批流程
export function addAudit(data) {
  return request({
    url: "/zw/audit",
    method: "post",
    data: data,
  });
}

// 修改审批流程
export function updateAudit(data) {
  return request({
    url: "/zw/audit",
    method: "put",
    data: data,
  });
}

// 删除审批流程
export function delAudit(id) {
  return request({
    url: "/zw/audit/" + id,
    method: "delete",
  });
}
