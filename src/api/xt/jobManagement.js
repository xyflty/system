import request from "@/utils/request";

// 资质工单处理
export const xtOrderJobManageList = (query) => {
  return request({
    url: "/xt/orderJobManage/list",
    method: "get",
    params: query,
  });
};

// 工单管理提交申请
export const xtOrderJobManageSubmitAudit = (data) => {
  return request({
    url: "/xt/orderJobManage/submitAudit",
    method: "post",
    data,
  });
};

// 查询工单管理详情
export const xtOrderJobManageGetInfo = (query) => {
  return request({
    url: "/xt/orderJobManage/getInfo",
    method: "get",
    params: query,
  });
};
// 根据订单 id 获取项目列表
export const coreOrderProjectGetOrderProjectListByOrderId = (orderld) => {
  return request({
    url: `/core/orderProject/getOrderProjectListByOrderId/${orderld}`,
    method: "get",
  });
};

// 工单拆单规则列表
export const synergyOrderJobSplitRuleList = (query) => {
  return request({
    url: "/synergy/orderJobSplitRule/list",
    method: "get",
    params: query,
  });
};

// 删除工单拆单规则
export const synergyOrderJobSplitRuleDelete = (query) => {
  return request({
    url: "/synergy/orderJobSplitRule/deleteRule",
    method: "DELETE",
    params: query,
  });
};
// 删除工单拆单规则 子项
export const synergyOrderJobSplitRuleDeleteRuleSub = (query) => {
  return request({
    url: "/synergy/orderJobSplitRule/deleteRuleSub",
    method: "DELETE",
    params: query,
  });
};

// 变更工单拆单规则启用状态
export const synergyOrderJobSplitRuleUpdateEnable = (data) => {
  return request({
    url: "/synergy/orderJobSplitRule/updateEnable",
    method: "put",
    data,
  });
};

// 获取对应项目的节点
export const synergyNodeGetProcessNodeByOrderProject = (query) => {
  return request({
    url: "/synergy/node/getProcessNodeByOrderProject",
    method: "get",
    params: query,
  });
};
// 新增工单拆单规则
export const synergyOrderJobSplitRuleAdd = (data) => {
  return request({
    url: "/synergy/orderJobSplitRule/add",
    method: "post",
    data,
  });
};

// 新增工单拆单规则
export const xtOrderJobManageExitOrder = (query) => {
  return request({
    url: "/xt/synergyOrder/exitOrder",
    method: "get",
    params: query,
  });
};
