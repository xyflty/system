import request from "@/utils/request";

// 获取日期范围内每月的线索、挖需、商机、订单、客户新增数
export function getAllCountByDate(query) {
  return request({
    url: "/zw/StatisticalReport/getAllCountByDate",
    method: "get",
    params: query,
  });
}

// 获取日期范围内每月的线索、挖需、商机、订单、客户新增数
export function getAllCountByUser(query) {
  return request({
    url: "/zw/StatisticalReport/getAllCountByUser",
    method: "get",
    params: query,
  });
}

// 获取日期范围内每人的线索、挖需、商机、订单、客户跟进数
export function getAllFollowTypeCount(query) {
  return request({
    url: "/zw/StatisticalReport/getAllFollowTypeCount",
    method: "get",
    params: query,
  });
}

// 获取日期范围内每人的跟进方式数
export function getAllFollowMethodCount(query) {
  return request({
    url: "/zw/StatisticalReport/getAllFollowMethodCount",
    method: "get",
    params: query,
  });
}

// 业务综合统计
export function getDataByParam(query) {
  return request({
    url: "/zw/StatisticalReport/getDataByParam",
    method: "get",
    params: query,
  });
}

// 业务综合统计-同比增长率和环比增长率
export function getGrowthRateByDate(query) {
  return request({
    url: "/zw/StatisticalReport/getGrowthRateByDate",
    method: "get",
    params: query,
  });
}

// 销售漏斗分析
export function getAllStatusCountByDate(query) {
  return request({
    url: "/zw/StatisticalReport/getAllStatusCountByDate",
    method: "get",
    params: query,
  });
}

// ======================================== 销售业绩统计 ========================================

// 成交客户汇总
export function getDealCustomerSummary(query) {
  return request({
    url: "/zw/salesPerformanceStatistical/getDealCustomerSummary",
    method: "get",
    params: query,
  });
}
// 成交客户汇总 列表
export function getDealCustomerSummaryList(query) {
  return request({
    url: "/zw/salesPerformanceStatistical/getDealCustomerSummaryList",
    method: "get",
    params: query,
  });
}

// 业绩目标完成度
export function getPerformanceTargetChartVo(query) {
  return request({
    url: "/zw/salesPerformanceStatistical/getPerformanceTargetChartVo",
    method: "get",
    params: query,
  });
}
// 业绩目标完成度 列表
export function getPerformanceTargetList(query) {
  return request({
    url: "/zw/salesPerformanceStatistical/getPerformanceTargetList",
    method: "get",
    params: query,
  });
}

// 产品销售汇总-按产品汇总
export function getAllProjectSale(query) {
  return request({
    url: "/zw/StatisticalReport/getAllProjectSale",
    method: "get",
    params: query,
  });
}
// 产品销售汇总-按分类汇总
export function getAllProjectSaleByCategory(query) {
  return request({
    url: "/zw/StatisticalReport/getAllProjectSaleByCategory",
    method: "get",
    params: query,
  });
}

// 产品销售汇总-按时间汇总
export function getAllProjectSaleByDate(query) {
  return request({
    url: "/zw/StatisticalReport/getAllProjectSaleByDate",
    method: "get",
    params: query,
  });
}

// ======================================== 销售统计排名 ========================================

// 业绩完成度排名
export function getBusinessCompleteRank(query) {
  return request({
    url: "/zw/salesRankStatistical/getBusinessCompleteRank",
    method: "get",
    params: query,
  });
}
// 业绩完成度排名 列表
export function getBusinessCompleteRankList(query) {
  return request({
    url: "/zw/salesRankStatistical/getBusinessCompleteRankList",
    method: "get",
    params: query,
  });
}
// 业务新增
export function getBusinessAddRank(query) {
  return request({
    url: "/zw/salesRankStatistical/getBusinessAddRank",
    method: "get",
    params: query,
  });
}
// 业务新增 列表
export function getBusinessAddRankList(query) {
  return request({
    url: "/zw/salesRankStatistical/getBusinessAddRankList",
    method: "get",
    params: query,
  });
}
// 成交数据排名
export function getDealDataRank(query) {
  return request({
    url: "/zw/salesRankStatistical/getDealDataRank",
    method: "get",
    params: query,
  });
}
// 成交数据排名 列表
export function getDealDataRankList(query) {
  return request({
    url: "/zw/salesRankStatistical/getDealDataRankList",
    method: "get",
    params: query,
  });
}
// 转化率排名
export function getTransRateRank(query) {
  return request({
    url: "/zw/salesRankStatistical/getTransRateRank",
    method: "get",
    params: query,
  });
}
// 转化率排名 列表
export function getTransRateRankList(query) {
  return request({
    url: "/zw/salesRankStatistical/getTransRateRankList",
    method: "get",
    params: query,
  });
}
// 跟进拜访排名
export function getFollowUpRank(query) {
  return request({
    url: "/zw/salesRankStatistical/getFollowUpRank",
    method: "get",
    params: query,
  });
}
// 跟进拜访排名 列表
export function getFollowUpRankList(query) {
  return request({
    url: "/zw/salesRankStatistical/getFollowUpRankList",
    method: "get",
    params: query,
  });
}

// ======================================== 客户数据分析 ========================================

// 获取客户等级数
export function getCustomerGradeCount(query) {
  return request({
    url: "/zw/customerStatistical/getCustomerGradeCount",
    method: "get",
    params: query,
  });
}

// 获取客户来源数
export function getCustomerSourceCount(query) {
  return request({
    url: "/zw/customerStatistical/getCustomerSourceCount",
    method: "get",
    params: query,
  });
}

// 获取客户城市数
export function getCustomerCityCount(query) {
  return request({
    url: "/zw/customerStatistical/getCustomerCityCount",
    method: "get",
    params: query,
  });
}

// 获取客户首次成交率、续约率、流失率
export function getCustomerRate(query) {
  return request({
    url: "/zw/customerStatistical/getCustomerRate",
    method: "get",
    params: query,
  });
}

// 成交客户总汇-某月订单列表
export function getTransactionAmountDetails(query) {
  return request({
    url: "/zw/salesPerformanceStatistical/getTransactionAmountDetails",
    method: "get",
    params: query,
  });
}

// 成交客户总汇-订单详情
export function getTransactionDetails(query) {
  return request({
    url: "/zw/salesPerformanceStatistical/getTransactionDetails",
    method: "get",
    params: query,
  });
}

// 销售业绩对比分析-图像
export function getSalesChart(query) {
  return request({
    url: "/zw/StatisticalReport/getSalesPerformanceAnalysisAndComparisonChart",
    method: "get",
    params: query,
  });
}

// 销售业绩对比分析-列表
export function getSalesList(query) {
  return request({
    url: "/zw/StatisticalReport/getSalesPerformanceAnalysisAndComparisonList",
    method: "get",
    params: query,
  });
}

// 业务新增汇总-列表
export function getAllCountByDateMerge(query) {
  return request({
    url: "/zw/StatisticalReport/getAllCountByDateMerge",
    method: "get",
    params: query,
  });
}

// 业务新增汇总-列表
export function getAllCountByUserMerge(query) {
  return request({
    url: "/zw/StatisticalReport/getAllCountByUserMerge",
    method: "get",
    params: query,
  });
}

// 客户质量
export function getCustomerQualityList(query) {
  return request({
    url: "/core/customerArchive/getCustomerQualityList",
    method: "get",
    params: query,
  });
}
