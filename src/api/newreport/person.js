import request from "@/utils/request";

// 个人客户成交数据列表
export function customerDealList(query) {
  return request({
    url: "/zw/customerDeal/list",
    method: "get",
    params: query,
  });
}

// 个人项目营收列表
export function projectDealList(query) {
  return request({
    url: "/zw/projectDeal/list",
    method: "get",
    params: query,
  });
}
