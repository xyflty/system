import request from "@/utils/request";

// 客户数据分析 主页-顶部模块
export function getHeaderData(query) {
  return request({
    url: "/zw/customerAnalysis/getHeaderData",
    method: "get",
    params: query,
  });
}

// 客户数据分析 主页-饼状图
export function getPieChart(query) {
  return request({
    url: "/zw/customerAnalysis/getPieChart",
    method: "get",
    params: query,
  });
}

// 客户数据分析 主页-柱状图
export function getDataHistogram(query) {
  return request({
    url: "/zw/customerAnalysis/getDataHistogram",
    method: "get",
    params: query,
  });
}

// 客户数据分析 主页-矩阵图
export function getDistributionMap(query) {
  return request({
    url: "/zw/customerAnalysis/getDistributionMap",
    method: "get",
    params: query,
  });
}

// 客户数据分析 主页-业绩数据列表
export function getPerformanceDataList(query) {
  return request({
    url: "/zw/customerAnalysis/getPerformanceDataList",
    method: "get",
    params: query,
  });
}

// 导出数据
export function exportData(query) {
  return request({
    url: "/zw/customerAnalysis/export",
    method: "post",
    params: query,
  });
}

// 客户转化率图
export function getConversionAnalysis(query) {
  return request({
    url: "/zw/customerAnalysis/getConversionAnalysis",
    method: "get",
    params: query,
  });
}

// 客户转化率列表
export function getConversionAnalysisList(query) {
  return request({
    url: "/zw/customerAnalysis/getConversionAnalysisList",
    method: "get",
    params: query,
  });
}
// 客户转化率列表
export function getConversionAnalysisDeptList(query) {
  return request({
    url: "/zw/customerAnalysis/getConversionAnalysisDeptList",
    method: "get",
    params: query,
  });
}

// 部门列表钻取跳员工列表
export function deptJumpEmployeesList(query) {
  return request({
    url: "/zw/customerAnalysis/deptJumpEmployeesList",
    method: "get",
    params: query,
  });
}

// 员工列表钻取跳详细分析列表
export function employeesJumpDetail(query) {
  return request({
    url: "/zw/customerAnalysis/employeesJumpDetail",
    method: "get",
    params: query,
  });
}

// 队伍列表
export function getTeamList(query) {
  return request({
    url: "/zw/customerAnalysis/getTeamList",
    method: "get",
    params: query,
  });
}

// 队伍跳成交列表
export function jumpDealList(query) {
  return request({
    url: "/zw/customerAnalysis/jumpDealList",
    method: "get",
    params: query,
  });
}

// 队伍跳客户列表
export function jumpCustomerList(query) {
  return request({
    url: "/zw/customerAnalysis/jumpCustomerList",
    method: "get",
    params: query,
  });
}

// 客户跳转介绍客户列表
export function jumpReferralCustomerList(query) {
  return request({
    url: "/zw/customerAnalysis/jumpReferralCustomerList",
    method: "get",
    params: query,
  });
}

// 客户跳转介绍客户列表
export function customerDealCountList(query) {
  return request({
    url: "/zw/customerAnalysis/customerDealCountList",
    method: "get",
    params: query,
  });
}

// 饼图-数据来源占比钻取
export function dataSourcePercentageDeptList(query) {
  return request({
    url: "/zw/customerAnalysis/dataSourcePercentageDeptList",
    method: "get",
    params: query,
  });
}

// 数据来源占比用户列表
export function dataSourcePercentageUserList(query) {
  return request({
    url: "/zw/customerAnalysis/dataSourcePercentageUserList",
    method: "get",
    params: query,
  });
}

// 数据来源占比用户列表
export function dataSourceTypeList(query) {
  return request({
    url: "/zw/customerAnalysis/dataSourceTypeList",
    method: "get",
    params: query,
  });
}

// 饼图-项目大类列表-部门
export function projectBigClassDeptList(query) {
  return request({
    url: "/zw/customerAnalysis/projectBigClassDeptList",
    method: "get",
    params: query,
  });
}

// 项目大类列表-用户
export function projectBigClassUserList(query) {
  return request({
    url: "/zw/customerAnalysis/projectBigClassUserList",
    method: "get",
    params: query,
  });
}
// 项目大类列表
export function getProjectBigClassList(query) {
  return request({
    url: "/zw/customerAnalysis/getProjectBigClassList",
    method: "get",
    params: query,
  });
}
// 城市分布列表-队伍
export function getCityDistributeTeamList(query) {
  return request({
    url: "/zw/customerAnalysis/getCityDistributeTeamList",
    method: "get",
    params: query,
  });
}
// 城市分布列表-用户
export function getCityDistributeUserList(query) {
  return request({
    url: "/zw/customerAnalysis/getCityDistributeUserList",
    method: "get",
    params: query,
  });
}
// 城市分布列表-业务占比
export function getBusinessPercentagesList(query) {
  return request({
    url: "/zw/customerAnalysis/getBusinessPercentagesList",
    method: "get",
    params: query,
  });
}
// 关联产品数列表
export function associatedProductList(query) {
  return request({
    url: "/zw/customerAnalysis/associatedProductList",
    method: "get",
    params: query,
  });
}

// 堆叠面积图
export function getStackedAreaChart(query) {
  return request({
    url: "/zw/customerAnalysis/getStackedAreaChart",
    method: "get",
    params: query,
  });
}

// 客户等级占比用户列表
export function customerGradePercentageUserList(query) {
  return request({
    url: "/zw/customerAnalysis/customerGradePercentageUserList",
    method: "get",
    params: query,
  });
}
// 客户等级占比部门列表
export function customerGradePercentageDeptList(query) {
  return request({
    url: "/zw/customerAnalysis/customerGradePercentageDeptList",
    method: "get",
    params: query,
  });
}
