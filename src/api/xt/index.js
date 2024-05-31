import request from "@/utils/request";
// 查询项目变更审核记录列表
export const xtOrderProjectChangeAuditList = (query) => {
  return request({
    url: "/xt/orderProjectChangeAudit/list",
    method: "get",
    params: query,
  });
};

// 获取项目变更审核记录详细信息
export const xtOrderProjectChangeAudit = (orderId) => {
  return request({
    url: `/xt/orderProjectChangeAudit/${orderId}`,
    method: "get",
  });
};

// 获取项目变更审核记录详细信息
export const xtOrderProjectChangeAuditAuditSubmit = (orderId) => {
  return request({
    url: `/xt/orderProjectChangeAudit/auditSubmit`,
    method: "post",
  });
};

// 获取项目变更详细信息
export const xtOrderProjectChangeAuditGetItemModifiedInfo = (orderId) => {
  return request({
    url: `/xt/orderProjectChangeAudit/getItemModifiedInfo/${orderId}`,
    method: "get",
  });
};

// 改单
export const xtOrderProjectChangeAuditItemModified = (data) => {
  return request({
    url: `/xt/orderProjectChangeAudit/itemModified`,
    method: "put",
    data,
  });
};

// 停单
export const xtOrderProjectChangeAuditStopItemModified = (data) => {
  return request({
    url: `/xt/orderProjectChangeAudit/stopItemModified`,
    method: "put",
    data,
  });
};

// 新增项目
export const xtOrderProjectChangeAuditNewOrderItemModified = (data) => {
  return request({
    url: `/xt/orderProjectChangeAudit/newOrderItemModified`,
    method: "post",
    data,
  });
};

// 项目变更审批提交
export const xtProjectChangeAuditAuditSubmit = (data) => {
  return request({
    url: `/xt/orderProjectChangeAudit/auditSubmit`,
    method: "post",
    data,
  });
};

// 项目变更审批通过
export const xtOrderProjectChangeAuditAuditPass = (data) => {
  return request({
    url: `/xt/orderProjectChangeAudit/auditPass`,
    method: "put",
    data,
  });
};

// 项目变更审批未通过
export const xtOrderProjectChangeAuditAuditNotPass = (data) => {
  return request({
    url: `/xt/orderProjectChangeAudit/auditNotPass`,
    method: "put",
    data,
  });
};

// 获取项目变更记录详细信息
export const xtOrderProjectChangeRecord = (orderId) => {
  return request({
    url: `/xt/orderProjectChangeRecord/${orderId}`,
    method: "get",
  });
};

// 二次配置改单
export const xtOrderProjectChangeRecordItemModified = (data) => {
  return request({
    url: `/xt/orderProjectChangeRecord/itemModified`,
    method: "put",
    data,
  });
};
// 二次配置停单
export const xtOrderProjectChangeRecordStopItemModified = (data) => {
  return request({
    url: `/xt/orderProjectChangeRecord/stopItemModified`,
    method: "put",
    data,
  });
};

// 二次配置新增项目
export const xtOrderProjectChangeRecordNewOrderItemModified = (data) => {
  return request({
    url: `/xt/orderProjectChangeRecord/newOrderItemModified`,
    method: "post",
    data,
  });
};

// 二次配置项目变更提交
export const xtOrderProjectChangeRecordItemModifiedSubmit = (data) => {
  return request({
    url: `/xt/orderProjectChangeRecord/itemModifiedSubmit`,
    method: "put",
    data,
  });
};

// 查询项目变更记录列表
export const xtOrderProjectChangeRecordList = (query) => {
  return request({
    url: `/xt/orderProjectChangeRecord/list`,
    method: "get",
    params: query,
  });
};

// 一键转换
export const zwOneKeyConvert = (data) => {
  return request({
    url: `/zw/oneKey/convert`,
    method: "put",
    data,
  });
};

// 一键转换
export const xtOrderJobOneKeyConvert = (data) => {
  return request({
    url: `/xt/orderJob/oneKeyConvert`,
    method: "put",
    data,
  });
};
