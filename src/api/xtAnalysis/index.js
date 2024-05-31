import request from "@/utils/request";
// 获取类型页面数据
export const getSynergyDataAnalysisContainer = (query) => {
  return request({
    url: "/xt/synergyDataAnalysis/getSynergyDataAnalysisContainer",
    method: "get",
    params: query,
  });
};
// 获取类型页面列表数据
export const QueryOrderJobPageList = (query) => {
  return request({
    url: "/xt/synergyDataAnalysis/queryOrderJobPageList",
    method: "get",
    params: query,
  });
};

// 获取类型页面数据钻取
export const drillTake = (query) => {
  return request({
    url: "/xt/synergyDataAnalysis/drillTake",
    method: "get",
    params: query,
  });
};
