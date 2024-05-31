import request from "@/utils/request";

//查询货源匹配管理列表
export function sourceMatchingList(query) {
  return request({
    url: "/core/sourceMatching/list",
    method: "get",
    params: query,
  });
}

//市场新增货源匹配管理
export function sourceMatchingAdd(data) {
  return request({
    url: "/core/sourceMatching/addMarkets",
    method: "post",
    data,
  });
}

//获取货源匹配管理详细信息
export function sourceMatchingDetail(id) {
  return request({
    url: `/core/sourceMatching/${id}`,
    method: "get",
  });
}

//市场修改货源匹配管理
export function sourceMatchingEdit(data) {
  return request({
    url: "/core/sourceMatching/editMarkets",
    method: "put",
    data,
  });
}

//渠道反馈货源匹配管理
export function sourceMatchingEditChannel(data) {
  return request({
    url: "/core/sourceMatching/editChannel",
    method: "put",
    data,
  });
}
