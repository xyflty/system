import request from "@/utils/request";

// 顶部数据概览
export function getDataOverview(query) {
  return request({
    url: "/zw/customerAnalysis/getDataOverview",
    method: "get",
    params: query,
  });
}

// 线索重复明细
export function clueRepeatPageList(query) {
  return request({
    url: "/zw/customerAnalysis/clueRepeatPageList",
    method: "get",
    params: query,
  });
}

// 客户数据重复明细
export function customerRepeatPageList(query) {
  return request({
    url: "/zw/customerAnalysis/customerRepeatPageList",
    method: "get",
    params: query,
  });
}

// 商机重复明细-按企业名称
export function opportunityRepeatCompanyPageList(query) {
  return request({
    url: "/zw/customerAnalysis/opportunityRepeatCompanyPageList",
    method: "get",
    params: query,
  });
}

// 商机重复明细-按商机标题
export function opportunityRepeatTitlePageList(query) {
  return request({
    url: "/zw/customerAnalysis/opportunityRepeatTitlePageList",
    method: "get",
    params: query,
  });
}

// 线索重复明细-钻取
export function clueRepeatPageListInto(query) {
  return request({
    url: "/zw/customerAnalysis/clueRepeatPageListInto",
    method: "get",
    params: query,
  });
}

// 客户数据重复明细-钻取
export function customerRepeatPageListInto(query) {
  return request({
    url: "/zw/customerAnalysis/customerRepeatPageListInto",
    method: "get",
    params: query,
  });
}

//商机重复明细-按企业名称-钻取
export function opportunityRepeatCompanyPageListInto(query) {
  return request({
    url: "/zw/customerAnalysis/opportunityRepeatCompanyPageListInto",
    method: "get",
    params: query,
  });
}

// 商机重复明细-按商机标题-钻取
export function opportunityRepeatTitlePageListInto(query) {
  return request({
    url: "/zw/customerAnalysis/opportunityRepeatTitlePageListInto",
    method: "get",
    params: query,
  });
}

// 商机重复分类占比饼图
export function getOpportunityPieChart(query) {
  return request({
    url: "/zw/customerAnalysis/getOpportunityPieChart",
    method: "get",
    params: query,
  });
}

// 数据重复分布
export function getDataRepeatDistribution(query) {
  return request({
    url: "/zw/customerAnalysis/getDataRepeatDistribution",
    method: "get",
    params: query,
  });
}

// 线索重复明细-正在跟进
export function clueRepeatFollowUpPageList(query) {
  return request({
    url: "/zw/customerAnalysis/clueRepeatFollowUpPageList",
    method: "get",
    params: query,
  });
}

// 商机重复明细-正在跟进
export function opportunityRepeatFollowUpPageList(query) {
  return request({
    url: "/zw/customerAnalysis/opportunityRepeatFollowUpPageList",
    method: "get",
    params: query,
  });
}

// 客户数据重复明细-正在跟进
export function customerRepeatFollowUpPageList(query) {
  return request({
    url: "/zw/customerAnalysis/customerRepeatFollowUpPageList",
    method: "get",
    params: query,
  });
}
