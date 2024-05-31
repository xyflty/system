import request from "@/utils/request";

// 查询工单作业列表
export const xtOrderJobCenterList = (query) => {
  return request({
    url: "/xt/orderJobCenter/list",
    method: "get",
    params: query,
  });
};
// 获取工单作业详细信息
export const xtOrderJobCenter = (query) => {
  return request({
    url: `/xt/orderJobCenter/orderJobCenterInfo`,
    method: "get",
    params: query,
  });
};
// 查询工单节点流程
export const synergyNodeQueryProcess = (query) => {
  return request({
    url: `/synergy/node/queryProcessForOperation`,
    method: "get",
    params: query,
  });
};
// 作业信息
export const synergyNodeHandleFillInfo = (query) => {
  return request({
    url: `/synergy/node/handleFillInfoButton`,
    method: "put",
    params: query,
  });
};
// 资料员提请收款确认 按钮
export const synergyNodeHandleLaunchMoney = (query) => {
  return request({
    url: `/synergy/node/handleLaunchMoneyButton`,
    method: "put",
    params: query,
  });
};
// 工单信息补充 按钮
export const synergyNodeHandleOrderJobInfoButton = (data) => {
  return request({
    url: `/synergy/node/handleOrderJobInfoButton`,
    method: "put",
    data,
  });
};
// 获取财务人员确认首款时展示的信息
export const synergyNodeGetFinancialConfirmMoneyInfo = (query) => {
  return request({
    url: `/synergy/node/getFinancialConfirmMoneyInfo`,
    method: "put",
    params: query,
  });
};
// 收款确认 按钮
export const synergyNodeHandleConfirmMoneyButton = (data) => {
  return request({
    url: `/synergy/node/handleConfirmMoneyButton`,
    method: "put",
    data
  });
};
// 开始节点作业 按钮
export const synergyNodeHandleStart = (query) => {
  return request({
    url: `/synergy/node/handleStartButton`,
    method: "put",
    params: query,
  });
};
// 作业节点结束
export const synergyNodeHandleFinish = (query) => {
  return request({
    url: `/synergy/node/handleFinishButton`,
    method: "put",
    params: query,
  });
};

// 订单相关所有工单节点状态预览
export const synergyNodeGetOrderJobAllProcessNodePreview = (query) => {
  return request({
    url: `/synergy/node/getOrderJobAllProcessNodePreview`,
    method: "get",
    params: query,
  });
};

// 工单节点状态预览
export const synergyNodeGetOrderJobProcessNodePreview = (query) => {
  return request({
    url: `/synergy/node/getOrderJobProcessNodePreview`,
    method: "get",
    params: query,
  });
};
// 根据协同项目类型获取相应节点
export const synergyNodeGetProcessNodeByProjectCategory = (query) => {
  return request({
    url: `/synergy/node/getProcessNodeByOrderProject`,
    method: "get",
    params: query,
  });
};