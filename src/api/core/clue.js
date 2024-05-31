import request from "@/utils/request";

// 查询线索记录列表
export function listClue(query) {
  return request({
    url: "/zw/clue/list",
    method: "get",
    params: query,
  });
}

// 查询线索记录详细
export function getClue(id) {
  return request({
    url: "/zw/clue/" + id,
    method: "get",
  });
}

// 新增线索记录
export function addClue(data) {
  return request({
    url: "/zw/clue",
    method: "post",
    data: data,
  });
}

// 修改线索记录
export function updateClue(data) {
  return request({
    url: "/zw/clue",
    method: "put",
    data: data,
  });
}

// 删除线索记录
export function delClue(id) {
  return request({
    url: "/zw/clue/" + id,
    method: "delete",
  });
}

// 置顶或取消置顶
export function setTop(data) {
  return request({
    url: "/zw/clue/setTop",
    method: "put",
    data: data,
  });
}

// 转为挖需
export function convert(data) {
  return request({
    url: "/zw/clue/convert",
    method: "put",
    data: data,
  });
}

// 新增跟进
export function followUp(data, query) {
  return request({
    url: `/zw/${query.type}/followUp`,
    method: "post",
    data: data,
  });
}

// 下载导入模板
export function importTemplate() {
  return request({
    url: "/zw/clue/importTemplate",
    method: "get",
    responseType: "blob",
  });
}

// 资质列表查询
export function getQualification(query) {
  return request({
    url: "/core/buildingQualification/getQualification",
    method: "get",
    params: query,
  });
}

// 联系信息列表
export function getContactInfoList(query) {
  return request({
    url: "/zw/contactInfo/getContactInfoList",
    method: "get",
    params: query,
  });
}

// 下拉框联系人信息
export function getContactInfoSelectList(query) {
  return request({
    url: "/zw/contactInfo/getContactInfoSelectList",
    method: "get",
    params: query,
  });
}

// 删除联系人
export function removeContactInfoById(data) {
  return request({
    url: `/zw/clue/removeContactInfoById`,
    method: "post",
    data: data,
  });
}

// 获取企业名称列表
export function customerArchiveListByName(query) {
  return request({
    url: "/zw/customerArchive/listByName",
    method: "get",
    params: query,
  });
}

export function associateClueData(query) {
  return request({
    url: `/zw/clue/associateData`,
    method: "get",
    params: query,
  });
}
