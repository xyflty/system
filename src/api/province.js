import request from "@/utils/request";

// 获取路由
export function getProvince(query) {
  return request({
    url: "/zw/resolution",
    method: "get",
    params: query,
  });
}
