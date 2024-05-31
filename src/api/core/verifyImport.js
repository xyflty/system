import request from "@/utils/request";

//查询动态核查列表
export function companyCheckSituationList(query) {
  return request({
    url: "/zw/companyCheckSituation/list",
    method: "get",
    params: query,
  });
}

//新增动态核查
export function companyCheckSituationAdd(data) {
  return request({
    url: "/zw/companyCheckSituation",
    method: "post",
    data,
  });
}
// 修改动态核查
export function companyCheckSituationEdit(data) {
  return request({
    url: "/zw/companyCheckSituation",
    method: "put",
    data,
  });
}
// 删除动态核查
export function companyCheckSituationRemove(ids) {
  return request({
    url: `/zw/companyCheckSituation/${ids}`,
    method: "delete",
  });
}
// 获取动态核查详细信息
export function getCompanyCheckSituation(id) {
  return request({
    url: `/zw/companyCheckSituation/${id}`,
    method: "get",
  });
}
// 下载导入模板
export function importTemplate() {
  return request({
    url: "/zw/companyCheckSituation/importTemplate",
    method: "get",
    responseType: "blob",
  });
}
