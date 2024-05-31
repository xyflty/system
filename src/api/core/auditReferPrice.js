import request from "@/utils/request";

// 查询审批流程报价列表
export function listAuditReferPrice(query) {
  return request({
    url: "/zw/auditReferPrice/list",
    method: "get",
    params: query,
  });
}

// 查询审批流程报价列表
export function listByCompany(query) {
  return request({
    url: "/zw/auditReferPrice/listByCompany",
    method: "get",
    params: query,
  });
}
// 查询审批流程报价详细
export function getInfoByAuditId(query) {
  return request({
    url: "/zw/auditReferPrice/getInfoByAuditId",
    method: "get",
    params: query,
  });
}
// 查询审批流程报价详细
export function getAuditReferPrice(id) {
  return request({
    url: "/zw/auditReferPrice/" + id,
    method: "get",
  });
}

// 新增审批流程报价
export function addAuditReferPrice(data) {
  return request({
    url: "/zw/auditReferPrice",
    method: "post",
    data: data,
  });
}

// 新增审批流程报价
export function addAudit(data) {
  return request({
    url: "/zw/audit/audit",
    method: "post",
    data: data,
  });
}

// 修改审批流程报价
export function updateAuditReferPrice(data) {
  return request({
    url: "/zw/auditReferPrice",
    method: "put",
    data: data,
  });
}

// 删除审批流程报价
export function delAuditReferPrice(id) {
  return request({
    url: "/zw/auditReferPrice/" + id,
    method: "delete",
  });
}

// 报价详情-修改详情
export function modifyAuditReferPrice(data) {
  return request({
    url: "/zw/auditReferPrice",
    method: "PUT",
    data: data,
  });
}

// 报价详情-撤回申请
export function cancelAuditReferPrice(id) {
  return request({
    url: "/zw/auditReferPrice/withdrawApproval/" + id,
    method: "PUT",
  });
}

// 查询审批流程报价列表(渠道部)
export function listChannelAuditReferPrice(query) {
  return request({
    url: "/channel/channelAuditReferPrice/list",
    method: "get",
    params: query,
  });
}
