import request from "@/utils/request";

// 查询财务结算中心列表
export const xtFinancialSettlementList = (query) => {
  return request({
    url: "/xt/financialSettlement/list",
    method: "get",
    params: query,
  });
};
// 财务结算中心详情
export const xtFinancialSettlementFinancialInfo = (query) => {
  return request({
    url: `/xt/financialSettlement/financialInfo`,
    method: "get",
    params: query,
  });
};

// 财务结算中心详情
export const xtBaseInfoProjectDetail = (query) => {
  return request({
    url: `/xt/baseInfo/projectDetail`,
    method: "get",
    params: query,
  });
};
//导出财务中心工单列表
export const xtFinancialSettlementExport = (data) => {
  return request({
    url: `/xt/financialSettlement/export`,
    method: "post",
    data: data,
  });
};

//获取财务详情的项目列表
export const xtFinancialSettlementProjectDetails = (query) => {
  return request({
    url: `/xt/financialSettlement/projectDetails`,
    method: "get",
    params: query,
  });
};
// 查询财务结算中心列表
export const xtFinancialSettlementSpecialOrderList = (query) => {
  return request({
    url: "/xt/financialSettlement/specialOrderList",
    method: "get",
    params: query,
  });
};
// 财务结算中心详情
export const xtFinancialSettlementSpecialOrderInfo = (query) => {
  return request({
    url: `/xt/financialSettlement/specialOrderInfo`,
    method: "get",
    params: query,
  });
};

// 财务结算中心-特殊订单核销
export const xtFinancialSettlementFinancialCheck = (data) => {
  return request({
    url: `/xt/financialSettlement/financialCheck`,
    method: "post",
    data,
  });
};

// 财务结算中心-特殊、普通订单核销查询
export const getFinancialCheckList = (query) => {
  return request({
    url: `/xt/financialSettlement/getFinancialCheckList`,
    method: "get",
    params: query,
  });
};
