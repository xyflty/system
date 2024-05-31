import request from "@/utils/request";

//查询动态核查对比列表
export function companyCheckSituationCompareList(query) {
  return request({
    url: "/zw/companyCheckSituationCompare/list",
    method: "get",
    params: query,
  });
}
