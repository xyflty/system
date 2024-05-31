import request from "@/utils/request";

// 查询商机记录列表
export function listOpportunity(query) {
  return request({
    url: "/zw/opportunity/list",
    method: "get",
    params: query,
  });
}

// 查询商机记录详细
export function getOpportunity(id) {
  return request({
    url: "/zw/opportunity/" + id,
    method: "get",
  });
}

// 新增商机记录
export function addOpportunity(data) {
  return request({
    url: "/zw/opportunity",
    method: "post",
    data: data,
  });
}

// 修改商机记录
export function updateOpportunity(data) {
  return request({
    url: "/zw/opportunity",
    method: "put",
    data: data,
  });
}

// 删除商机记录
export function delOpportunity(id) {
  return request({
    url: "/zw/opportunity/" + id,
    method: "delete",
  });
}

// 转为商机
export function convert(data) {
  return request({
    url: "/zw/opportunity/convert",
    method: "put",
    data: data,
  });
}

// 获取商机下拉列表
export function getOpportunityList() {
  return request({
    url: "/zw/opportunity/getAllOpportunityCompany",
    method: "get",
  });
}

// 置顶或取消置顶
export function setTop(data) {
  return request({
    url: "/zw/opportunity/setTop",
    method: "put",
    data: data,
  });
}

// 跟进
export function followUp(data) {
  return request({
    url: "/zw/opportunity/followUp",
    method: "post",
    data: data,
  });
}

// 分享商机
export function shareOpportunity(data) {
  return request({
    url: "/core/opportunity/share",
    method: "post",
    data: data,
  });
}

// 查询商机的重复客户
export function getDistinctCompanyList(query) {
  return request({
    url: "/zw/opportunity/distinctCompanyList",
    method: "get",
    params: query,
  });
}

// 更新是否商机流失
export function setLoss(data) {
  return request({
    url: "/zw/opportunity/setLoss",
    method: "put",
    data: data,
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

// 商机标题 -项目分类树型数据
export function getProjectCategoryTree(query) {
  return request({
    url: "/core/projectCategory/getProjectCategoryTree",
    method: "get",
    params: query,
  });
}

export function associateOpportunityData(query) {
  return request({
    url: `/zw/opportunity/associateData`,
    method: "get",
    params: query,
  });
}
