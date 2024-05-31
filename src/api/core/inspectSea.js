import request from "@/utils/request";

//查询动态核查资源库列表
export function dynamicVerifyLibraryList(query) {
  return request({
    url: "/zw/dynamicVerifyLibrary/list",
    method: "get",
    params: query,
  });
}

// 动态核查资源库-领取
export function dynamicVerifyLibraryTake(data) {
  return request({
    url: "/zw/dynamicVerifyLibrary/dynamicVerifyLibraryTake",
    method: "put",
    data,
  });
}
// 动态核查资源库-转为线索
export function dynamicVerifyLibraryConvertClue(data) {
  return request({
    url: "/zw/dynamicVerifyLibrary/convertClue",
    method: "put",
    data,
  });
}

// 动态核查资源库-手动放回动态核查资源库
export function putBack(data) {
  return request({
    url: "/zw/dynamicVerifyLibrary/putBack",
    method: "put",
    data,
  });
}

// 动态核查资源库-手动放回动态核查资源库
export function dynamicVerifyLibraryDetail(id) {
  return request({
    url: `/zw/dynamicVerifyLibrary/${id}`,
    method: "get",
  });
}

// 修改动态核查资源库
export function dynamicVerifyLibraryEdit(data) {
  return request({
    url: `/zw/dynamicVerifyLibrary`,
    method: "put",
    data,
  });
}
