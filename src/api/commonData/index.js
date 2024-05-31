import request from "@/utils/request";

// 查询状态列表
export function getCommonData(query) {
  return request({
    url: "/zw/constant/getConstant",
    method: "get",
    params: query,
  });
}
