import request from "@/utils/request";

// 资质工单处理
export const xtOrderJobList = (query) => {
  return request({
    url: "/xt/orderJob/list",
    method: "get",
    params: query,
  });
};

// 获取工单详细信息
export const xtOrderJob = (query) => {
  return request({
    url: `/xt/orderJob/orderJobInfo`,
    method: "get",
    params: query,
  });
};
// 获取工单详细信息
export const xtOrderJobAuditOrderJobAudit = (query) => {
  return request({
    url: `/xt/orderJobAudit/orderJobAudit`,
    method: "get",
    params: query,
  });
};

// 审核工单
export const xtOrderJobAuditPass = (data) => {
  return request({
    url: "/xt/orderJob/auditPass",
    method: "put",
    data,
  });
};
export const xtOrderJobAuditNotPass = (data) => {
  return request({
    url: "/xt/orderJob/auditNotPass",
    method: "put",
    data,
  });
};
// 分配工单
export const xtOrderJobAssignment = (data) => {
  return request({
    url: "/xt/orderJob/assignment",
    method: "put",
    data,
  });
};

// 暂缓工单
export const xtOrderJobRespite = (data) => {
  return request({
    url: "/xt/orderJob/respite",
    method: "put",
    data,
  });
};

// 退回工单
export const xtOrderJobWithdraw = (data) => {
  return request({
    url: "/xt/orderJob/withdraw",
    method: "put",
    data,
  });
};

// 获取详情页面的数据
export const synergyOrderDetails = (query) => {
  return request({
    url: `/xt/synergyOrder/details`,
    method: "get",
    params: query,
  });
};
// 获取详情页面的数据
export const xtSynergyOrderOrderUpdate = (data) => {
  return request({
    url: `/xt/synergyOrder/orderUpdate`,
    method: "post",
    data,
  });
};

// 修改协同项目基础信息
export const xtSynergyOrder = (data) => {
  return request({
    url: `/xt/synergyOrder`,
    method: "put",
    data,
  });
};

// 新增资料附件
export const systemResourceAnnex = (data) => {
  return request({
    url: `/system/resourceAnnex`,
    method: "post",
    data,
  });
};

// 查询资料附件列表
export const systemResourceAnnexList = (query) => {
  return request({
    url: `/system/resourceAnnex/list`,
    method: "get",
    params: query,
  });
};
// 删除资料附件
export const systemResourceAnnexDel = (ids) => {
  return request({
    url: `/system/resourceAnnex/${ids}`,
    method: "delete",
  });
};

// 协同下单获取订单记录详细信息
export const xtSynergyOrderForApproval = (data) => {
  return request({
    url: `/xt/synergyOrder/forApproval`,
    method: "post",
    data,
  });
};
// 返回已生成工单的订单项目id
export const xtSynergyOrderGetOrderJobIdList = (query) => {
  return request({
    url: `/xt/synergyOrder/getOrderJobIdList`,
    method: "get",
    params: query,
  });
};

// 自选订单项目生成工单
export const xtSynergyOrderGenerateOrderJob = (data) => {
  return request({
    url: `/xt/synergyOrder/generateOrderJob`,
    method: "post",
    data,
  });
};
// 项目类别列表
export const xtProjectCategory = () => {
  return request({
    url: `/xt/projectFilter/getProjectCategoryNameList`,
    method: "get",
  });
};
// 项目类别列表
export const xtProjectType = () => {
  return request({
    url: `/xt/projectFilter/getProjectTypeList`,
    method: "get",
  });
};

// 获取工单节点动态-展示
export const synergyNodeQueryProcessForShow = (query) => {
  return request({
    url: `/synergy/node/queryProcessForShow`,
    method: "get",
    params: query,
  });
};

// 获取工单节点动态-展示
export const xtSynergyOrderGetOrderSignSubject = () => {
  return request({
    url: `/xt/synergyOrder/getOrderSignSubject`,
    method: "get",
  });
};

// 获取订单所属部门
export const xtSynergyOrderGetOrderBelongsDept = (query) => {
  return request({
    url: `/xt/synergyOrder/getOrderBelongsDept`,
    method: "get",
    params: query,
  });
};

// 协同下单提交信息并审核
export const xtSynergyOrderProjectApproval = (data) => {
  return request({
    url: `/xt/synergyOrder/projectApproval`,
    method: "post",
    data,
  });
};

// 获取服务顾问（制）用户列表
export const xtServiceAdvisorUserGetMakeUserList = (query) => {
  return request({
    url: `/xt/serviceAdvisorUser/getMakeUserList`,
    method: "get",
    params: query,
  });
};

// 获取服务顾问（审）用户列表
export const xtServiceAdvisorUserGetAuditUserList = (query) => {
  return request({
    url: `/xt/serviceAdvisorUser/getAuditUserList`,
    method: "get",
    params: query,
  });
};

// 保存项目拆账
export const xtSynergyOrderSaveItemDismantle = (data) => {
  return request({
    url: `/xt/synergyOrder/saveItemDismantle`,
    method: "put",
    data,
  });
};

// 获取暂缓和退回工单的审批人
export const xtOrderJobExitOrder = (query) => {
  return request({
    url: `/xt/synergyOrder/exitOrder`,
    method: "get",
    params: query,
  });
};

// 获取暂缓和退回工单的审批人
export const xtOrderJobSubmitAudit = (data) => {
  return request({
    url: `/xt/orderJob/submitAudit`,
    method: "post",
    data,
  });
};

// 证书审核跳过
export const xtAllCertificateInfoSubmit = (data) => {
  return request({
    url: `/xt/synergyOrder/allCertificateInfoSubmit`,
    method: "put",
    data,
  });
};
