import request from "@/utils/request";

// 查询线索记录列表
export function list(params, query) {
  return request({
    url: `/zw/${query.type}/list`,
    method: "get",
    params,
  });
}
