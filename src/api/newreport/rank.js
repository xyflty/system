import request from "@/utils/request";

// 销售业绩排名分析 主页-基础排名列表
export function basicRankingList(query) {
  return request({
    url: "/zw/salesRankingAnalysis/basicRankingList",
    method: "get",
    params: query,
  });
}

// 销售业绩排名分析 主页-基础排名分析列表
export function basicRankingAnalysisList(query) {
  return request({
    url: "/zw/salesRankingAnalysis/basicRankingAnalysisList",
    method: "get",
    params: query,
  });
}

// 销售业绩排名分析 跟进次数排名列表
export function followUpNumList(query) {
  return request({
    url: "/zw/salesRankingAnalysis/followUpNumList",
    method: "get",
    params: query,
  });
}
// 销售业绩排名分析 主页-跟进次数排名分析列表
export function followUpNumAnalysisList(query) {
  return request({
    url: "/zw/salesRankingAnalysis/followUpNumAnalysisList",
    method: "get",
    params: query,
  });
}
// 销售业绩排名分析 主页-成交排名列表
export function dealRankingList(query) {
  return request({
    url: "/zw/salesRankingAnalysis/dealRankingList",
    method: "get",
    params: query,
  });
}
// 销售业绩排名分析 主页-成交排名分析列表
export function dealRankingAnalysisList(query) {
  return request({
    url: "/zw/salesRankingAnalysis/dealRankingAnalysisList",
    method: "get",
    params: query,
  });
}

// 销售业绩排名分析 主页-转化率排名列表
export function conversionRateRankingList(query) {
  return request({
    url: "/zw/salesRankingAnalysis/conversionRateRankingList",
    method: "get",
    params: query,
  });
}
// 销售业绩排名分析 主页-转化率排名分析列表
export function conversionRateAnalysisList(query) {
  return request({
    url: "/zw/salesRankingAnalysis/conversionRateAnalysisList",
    method: "get",
    params: query,
  });
}

// 销售业绩排名分析 主页-获取产品销售排名列表
export function projectSalesRankingList(query) {
  return request({
    url: "/zw/salesRankingAnalysis/projectSalesRankingList",
    method: "get",
    params: query,
  });
}

// 业绩目标完成度分析 主页-部门成交金额目标完成度列表
export function deptTargetAmountList(query) {
  return request({
    url: "/zw/salesRankingAnalysis/deptTargetAmountList",
    method: "get",
    params: query,
  });
}

//业绩目标完成度分析 根据当前登录人所在主体返回部门下拉树列表
export function treeselect(query) {
  return request({
    url: "/system/dept/treesSelectByUser",
    method: "get",
    params: query,
  });
}

//业绩目标完成度分析 用户成交金额目标完成度列表
export function userTargetAmountList(query) {
  return request({
    url: "/zw/salesRankingAnalysis/userTargetAmountList",
    method: "get",
    params: query,
  });
}

//业绩目标完成度分析 查询各数据来源的客户数
export function countCustomerDataSource(query) {
  return request({
    url: "/zw/salesRankingAnalysis/countCustomerDataSource",
    method: "get",
    params: query,
  });
}

//业绩目标完成度分析 查询各城市的客户数
export function countCustomerCity(query) {
  return request({
    url: "/zw/salesRankingAnalysis/countCustomerCity",
    method: "get",
    params: query,
  });
}

//业绩目标完成度分析 查询各客户等级的客户数
export function countCustomerGrade(query) {
  return request({
    url: "/zw/salesRankingAnalysis/countCustomerGrade",
    method: "get",
    params: query,
  });
}

//业绩目标完成度分析 查询各项目大类数
export function countTopCategory(query) {
  return request({
    url: "/zw/salesRankingAnalysis/countTopCategory",
    method: "get",
    params: query,
  });
}

//业绩目标完成度分析 获取客户行为
export function customerBehavior(query) {
  return request({
    url: "/zw/salesRankingAnalysis/customerBehavior",
    method: "get",
    params: query,
  });
}

//业绩目标完成度分析 查询项目的用户销售
export function projectUserSales(query) {
  return request({
    url: "/zw/salesRankingAnalysis/projectUserSales",
    method: "get",
    params: query,
  });
}

//业绩目标完成度分析 查询项目的销售信息
export function projectSalesInfo(query) {
  return request({
    url: "/zw/salesRankingAnalysis/projectSalesInfo",
    method: "get",
    params: query,
  });
}

//业绩目标完成度分析 查询订单信息
export function getOrder(query) {
  return request({
    url: "/zw/salesRankingAnalysis/getOrder",
    method: "get",
    params: query,
  });
}

// 产品销售数量分布列表
export function getSecondDeptProjectCount(query) {
  return request({
    url: "/zw/salesRankingAnalysis/getSecondDeptProjectCount",
    method: "get",
    params: query,
  });
}

// 获取项目分类扇形图
export function countCategoryOrProject(query) {
  return request({
    url: "/zw/salesRankingAnalysis/countCategoryOrProject",
    method: "get",
    params: query,
  });
}

// 扇形图钻取打开新窗口
export function getCategoryOrProject(query) {
  return request({
    url: "/zw/salesRankingAnalysis/getCategoryOrProject",
    method: "get",
    params: query,
  });
}

// 查询城市项目销售情况
export function getCityProjectSales(query) {
  return request({
    url: "/zw/salesRankingAnalysis/getCityProjectSales",
    method: "get",
    params: query,
  });
}

// k线图的数据请求
export function getSalePriceKLineDiagram(query) {
  return request({
    url: "/zw/salesRankingAnalysis/getSalePriceKLineDiagram",
    method: "get",
    params: query,
  });
}

// 点击集团军的数据请求
export function getNoneChildDeptSales(query) {
  return request({
    url: "/zw/salesRankingAnalysis/getNoneChildDeptSales",
    method: "get",
    params: query,
  });
}

// 点击集团军进入后表格上方数据预览
export function getNoneChildDeptSalesInfo(query) {
  return request({
    url: "/zw/salesRankingAnalysis/getNoneChildDeptSalesInfo",
    method: "get",
    params: query,
  });
}

// 点击集团军的后再次点击表格的跳转
export function getUserSales(query) {
  return request({
    url: "/zw/salesRankingAnalysis/getUserSales",
    method: "get",
    params: query,
  });
}

// 点击集团军的后再次点击表格的跳转后的数据预览
export function getUserSalesInfo(query) {
  return request({
    url: "/zw/salesRankingAnalysis/getUserSalesInfo",
    method: "get",
    params: query,
  });
}

// 城市点击钻取后的页面
export function cityDigInto(query) {
  return request({
    url: "/zw/salesRankingAnalysis/cityDigInto",
    method: "get",
    params: query,
  });
}
// 曲线点击表格内容跳转的页面
export function projectBigClassDigInto(query) {
  return request({
    url: "/zw/salesRankingAnalysis/projectBigClassDigInto",
    method: "get",
    params: query,
  });
}
// 曲线点击表格内容跳转的页面
export function customerDigInto(query) {
  return request({
    url: "/zw/salesRankingAnalysis/customerDigInto",
    method: "get",
    params: query,
  });
}

// 数据来源请求的页面
export function dataSourceDigInto(query) {
  return request({
    url: "/zw/salesRankingAnalysis/dataSourceDigInto",
    method: "get",
    params: query,
  });
}
