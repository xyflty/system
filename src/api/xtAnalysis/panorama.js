import request from "@/utils/request";
// 获取类型页面数据
export const getSynergyDataAnalysisContainer = (query) => {
  return request({
    url: "/xt/synergyDataPanoramicViewAnalysis/getSynergyDataAnalysisContainer",
    method: "get",
    params: query,
  });
};
// 获取类型页面列表数据
export const queryOrderJobPageList = (query) => {
  return request({
    url: "/xt/synergyDataPanoramicViewAnalysis/queryOrderJobPageList",
    method: "get",
    params: query,
  });
};

// 协同下单数量弹屏
export const getSynergyOrderQuantityScreenPopUpList = (query) => {
  return request({
    url: "/xt/synergyDataPanoramicViewAnalysis/getSynergyOrderQuantityScreenPopUpList",
    method: "get",
    params: query,
  });
};
